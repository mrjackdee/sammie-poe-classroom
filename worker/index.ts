/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { defaultClassroomContent, normalizeClassroomContent } from "../shared/classroom-content";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_EMAILS?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const CONTENT_ID = 1;

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

async function ensureContentTable(db: D1Database) {
  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS classroom_content (id INTEGER PRIMARY KEY NOT NULL, content_json TEXT NOT NULL, updated_at TEXT NOT NULL, updated_by TEXT NOT NULL)",
    )
    .run();
  await db
    .prepare(
      "INSERT OR IGNORE INTO classroom_content (id, content_json, updated_at, updated_by) VALUES (?, ?, ?, ?)",
    )
    .bind(CONTENT_ID, JSON.stringify(defaultClassroomContent), new Date().toISOString(), "site-defaults")
    .run();
}

async function readContent(db: D1Database) {
  await ensureContentTable(db);
  const row = await db
    .prepare("SELECT content_json, updated_at, updated_by FROM classroom_content WHERE id = ?")
    .bind(CONTENT_ID)
    .first<{ content_json: string; updated_at: string; updated_by: string }>();
  if (!row) return defaultClassroomContent;
  try {
    return normalizeClassroomContent({
      ...JSON.parse(row.content_json),
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
    });
  } catch {
    return defaultClassroomContent;
  }
}

function authorizedEmail(request: Request, env: Env) {
  const userId = request.headers.get("oai-authenticated-user-id")?.trim();
  const email = request.headers.get("oai-authenticated-user-email")?.trim().toLowerCase();
  const allowed = (env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return userId && email && allowed.includes(email) ? email : null;
}

async function handleContentApi(request: Request, env: Env, url: URL) {
  const isAdmin = url.pathname === "/api/admin/content";
  const publicHeaders = isAdmin
    ? undefined
    : { "access-control-allow-origin": "*", "access-control-allow-methods": "GET, OPTIONS" };

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: publicHeaders });
  if (!isAdmin && request.method !== "GET") return json({ error: "Method not allowed" }, { status: 405, headers: publicHeaders });

  if (isAdmin) {
    const email = authorizedEmail(request, env);
    if (!email) {
      return json(
        { error: "This signed-in account is not authorized to edit the classroom website." },
        { status: 403 },
      );
    }
    const origin = request.headers.get("origin");
    if (origin) {
      try {
        if (new URL(origin).origin !== url.origin) return json({ error: "Invalid request origin." }, { status: 403 });
      } catch {
        return json({ error: "Invalid request origin." }, { status: 403 });
      }
    }
    if (request.method === "GET") return json(await readContent(env.DB));
    if (request.method !== "PUT") return json({ error: "Method not allowed" }, { status: 405 });

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 100_000) return json({ error: "Update is too large." }, { status: 413 });
    const raw = await request.text();
    if (raw.length > 100_000) return json({ error: "Update is too large." }, { status: 413 });
    let submitted: unknown;
    try {
      submitted = JSON.parse(raw);
    } catch {
      return json({ error: "Invalid JSON." }, { status: 400 });
    }
    if (!submitted || typeof submitted !== "object" || Array.isArray(submitted)) {
      return json({ error: "Invalid classroom content." }, { status: 400 });
    }
    const updatedAt = new Date().toISOString();
    const content = normalizeClassroomContent({ ...(submitted as object), updatedAt, updatedBy: email });
    await ensureContentTable(env.DB);
    await env.DB
      .prepare(
        "INSERT INTO classroom_content (id, content_json, updated_at, updated_by) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET content_json = excluded.content_json, updated_at = excluded.updated_at, updated_by = excluded.updated_by",
      )
      .bind(CONTENT_ID, JSON.stringify(content), updatedAt, email)
      .run();
    return json(content);
  }

  try {
    return json(await readContent(env.DB), { headers: publicHeaders });
  } catch (error) {
    console.error("Unable to read classroom content", error);
    return json(defaultClassroomContent, {
      headers: { ...publicHeaders, "x-classroom-content-source": "defaults" },
    });
  }
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/content" || url.pathname === "/api/admin/content") {
      return handleContentApi(request, env, url);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
