/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { defaultClassroomContent, normalizeClassroomContent } from "../shared/classroom-content";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  MEDIA: R2Bucket;
  ADMIN_BOOTSTRAP_EMAIL?: string;
  ADMIN_BOOTSTRAP_PASSWORD_HASH?: string;
  ADMIN_BOOTSTRAP_PASSWORD_SALT?: string;
  ADMIN_PASSWORD_ITERATIONS?: string;
  ADMIN_SESSION_SECRET?: string;
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
const SESSION_COOKIE = "mr_poe_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;

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

type AdminAccount = {
  email: string;
  password_hash: string;
  password_salt: string;
  iterations: number;
  session_version: number;
};

const encoder = new TextEncoder();

function base64ToBytes(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function bytesToBase64Url(value: Uint8Array) {
  return btoa(String.fromCharCode(...value)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return base64ToBytes(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
}

async function derivePasswordHash(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256,
  );
  return new Uint8Array(bits);
}

async function passwordMatches(password: string, account: AdminAccount) {
  const expected = base64ToBytes(account.password_hash);
  const actual = await derivePasswordHash(password, base64ToBytes(account.password_salt), account.iterations);
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual[index] ^ expected[index];
  return difference === 0;
}

async function ensureAdminAccount(env: Env) {
  await env.DB
    .prepare(
      "CREATE TABLE IF NOT EXISTS admin_accounts (email TEXT PRIMARY KEY NOT NULL, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, iterations INTEGER NOT NULL, session_version INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL)",
    )
    .run();
  const email = env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const passwordHash = env.ADMIN_BOOTSTRAP_PASSWORD_HASH?.trim();
  const passwordSalt = env.ADMIN_BOOTSTRAP_PASSWORD_SALT?.trim();
  const iterations = Number(env.ADMIN_PASSWORD_ITERATIONS || 210000);
  if (!email || !passwordHash || !passwordSalt || !Number.isSafeInteger(iterations)) {
    throw new Error("Administrator credentials are not configured.");
  }
  await env.DB
    .prepare(
      "INSERT OR IGNORE INTO admin_accounts (email, password_hash, password_salt, iterations, session_version, updated_at) VALUES (?, ?, ?, ?, 1, ?)",
    )
    .bind(email, passwordHash, passwordSalt, iterations, new Date().toISOString())
    .run();
}

async function getAdminAccount(env: Env, email: string) {
  await ensureAdminAccount(env);
  return env.DB
    .prepare("SELECT email, password_hash, password_salt, iterations, session_version FROM admin_accounts WHERE email = ?")
    .bind(email.trim().toLowerCase())
    .first<AdminAccount>();
}

function readCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  for (const part of cookie.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

async function sessionKey(env: Env) {
  if (!env.ADMIN_SESSION_SECRET) throw new Error("Administrator session secret is not configured.");
  return crypto.subtle.importKey(
    "raw",
    base64ToBytes(env.ADMIN_SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function createSessionToken(env: Env, email: string, version: number) {
  const payload = bytesToBase64Url(
    encoder.encode(JSON.stringify({ email, version, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })),
  );
  const signature = await crypto.subtle.sign("HMAC", await sessionKey(env), encoder.encode(payload));
  return `${payload}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

async function getAdminSession(request: Request, env: Env) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await sessionKey(env),
      base64UrlToBytes(signature),
      encoder.encode(payload),
    );
    if (!valid) return null;
    const claims = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as {
      email?: string;
      version?: number;
      exp?: number;
    };
    if (!claims.email || !claims.version || !claims.exp || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    const account = await getAdminAccount(env, claims.email);
    if (!account || account.session_version !== claims.version) return null;
    return { email: account.email, version: account.session_version, account };
  } catch {
    return null;
  }
}

async function authorizedEmail(request: Request, env: Env) {
  return (await getAdminSession(request, env))?.email || null;
}

function sessionCookie(token: string, url: URL, maxAge = SESSION_SECONDS) {
  const secure = url.protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

function isSameOrigin(request: Request, url: URL) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === url.origin;
  } catch {
    return false;
  }
}

async function readSmallJson(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 8_000) throw new Error("Request is too large.");
  const raw = await request.text();
  if (raw.length > 8_000) throw new Error("Request is too large.");
  return JSON.parse(raw) as Record<string, unknown>;
}

async function handleAdminAuth(request: Request, env: Env, url: URL) {
  if (!isSameOrigin(request, url)) return json({ error: "Invalid request origin." }, { status: 403 });

  if (url.pathname === "/api/admin/session") {
    if (request.method !== "GET") return json({ error: "Method not allowed" }, { status: 405 });
    const session = await getAdminSession(request, env);
    return session
      ? json({ authenticated: true, email: session.email })
      : json({ authenticated: false }, { status: 401 });
  }

  if (url.pathname === "/api/admin/logout") {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, { status: 405 });
    const response = json({ ok: true });
    response.headers.set("set-cookie", sessionCookie("", url, 0));
    return response;
  }

  if (url.pathname === "/api/admin/login") {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, { status: 405 });
    let body: Record<string, unknown>;
    try {
      body = await readSmallJson(request);
    } catch {
      return json({ error: "Invalid sign-in request." }, { status: 400 });
    }
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password || password.length > 128) {
      return json({ error: "Email or password is incorrect." }, { status: 401 });
    }
    const account = await getAdminAccount(env, email);
    if (!account || !(await passwordMatches(password, account))) {
      return json({ error: "Email or password is incorrect." }, { status: 401 });
    }
    const token = await createSessionToken(env, account.email, account.session_version);
    const response = json({ authenticated: true, email: account.email });
    response.headers.set("set-cookie", sessionCookie(token, url));
    return response;
  }

  if (url.pathname === "/api/admin/change-password") {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, { status: 405 });
    const session = await getAdminSession(request, env);
    if (!session) return json({ error: "Please sign in again." }, { status: 401 });
    let body: Record<string, unknown>;
    try {
      body = await readSmallJson(request);
    } catch {
      return json({ error: "Invalid password-change request." }, { status: 400 });
    }
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
    if (!(await passwordMatches(currentPassword, session.account))) {
      return json({ error: "Current password is incorrect." }, { status: 400 });
    }
    if (newPassword.length < 12 || newPassword.length > 128) {
      return json({ error: "The new password must be between 12 and 128 characters." }, { status: 400 });
    }
    if (newPassword === currentPassword) {
      return json({ error: "Choose a password that is different from the current password." }, { status: 400 });
    }
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iterations = 210000;
    const hash = await derivePasswordHash(newPassword, salt, iterations);
    const nextVersion = session.version + 1;
    await env.DB
      .prepare(
        "UPDATE admin_accounts SET password_hash = ?, password_salt = ?, iterations = ?, session_version = ?, updated_at = ? WHERE email = ?",
      )
      .bind(
        btoa(String.fromCharCode(...hash)),
        btoa(String.fromCharCode(...salt)),
        iterations,
        nextVersion,
        new Date().toISOString(),
        session.email,
      )
      .run();
    const token = await createSessionToken(env, session.email, nextVersion);
    const response = json({ ok: true, email: session.email });
    response.headers.set("set-cookie", sessionCookie(token, url));
    return response;
  }

  return json({ error: "Not found" }, { status: 404 });
}

function verifiedImageType(bytes: Uint8Array) {
  const png = bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const jpeg = bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const webp = bytes.length > 12 && new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  return png ? "image/png" : jpeg ? "image/jpeg" : webp ? "image/webp" : null;
}

async function handleProfilePhoto(request: Request, env: Env, url: URL) {
  const key = "profile/mr-poe";
  if (url.pathname === "/media/profile-photo") {
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
    const object = await env.MEDIA.get(key);
    if (!object) return new Response("Photo not found", { status: 404 });
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    headers.set("x-content-type-options", "nosniff");
    return new Response(request.method === "HEAD" ? null : object.body, { headers });
  }

  const email = await authorizedEmail(request, env);
  if (!email) return json({ error: "This signed-in account is not authorized to manage profile photos." }, { status: 403 });
  if (!isSameOrigin(request, url)) return json({ error: "Invalid request origin." }, { status: 403 });

  if (request.method === "DELETE") {
    await env.MEDIA.delete(key);
    return json({ ok: true });
  }
  if (request.method !== "POST") return json({ error: "Method not allowed" }, { status: 405 });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (!contentLength || contentLength > 5_000_000) return json({ error: "Choose a JPG, PNG, or WebP image smaller than 5 MB." }, { status: 413 });
  const bytes = new Uint8Array(await request.arrayBuffer());
  const contentType = verifiedImageType(bytes);
  if (!contentType) return json({ error: "Only valid JPG, PNG, and WebP images are accepted." }, { status: 415 });
  await env.MEDIA.put(key, bytes, {
    httpMetadata: { contentType },
    customMetadata: { uploadedBy: email, uploadedAt: new Date().toISOString() },
  });
  return json({ url: `${url.origin}/media/profile-photo?v=${Date.now()}` });
}

async function handleContentApi(request: Request, env: Env, url: URL) {
  const isAdmin = url.pathname === "/api/admin/content";
  const publicHeaders = isAdmin
    ? undefined
    : { "access-control-allow-origin": "*", "access-control-allow-methods": "GET, OPTIONS" };

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: publicHeaders });
  if (!isAdmin && request.method !== "GET") return json({ error: "Method not allowed" }, { status: 405, headers: publicHeaders });

  if (isAdmin) {
    const email = await authorizedEmail(request, env);
    if (!email) {
      return json(
        { error: "This signed-in account is not authorized to edit the classroom website." },
        { status: 403 },
      );
    }
    if (!isSameOrigin(request, url)) return json({ error: "Invalid request origin." }, { status: 403 });
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

    if (
      url.pathname === "/api/admin/session" ||
      url.pathname === "/api/admin/login" ||
      url.pathname === "/api/admin/logout" ||
      url.pathname === "/api/admin/change-password"
    ) {
      return handleAdminAuth(request, env, url);
    }

    if (url.pathname === "/media/profile-photo" || url.pathname === "/api/admin/profile-photo") {
      return handleProfilePhoto(request, env, url);
    }

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
