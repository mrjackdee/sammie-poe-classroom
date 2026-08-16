import { NextResponse } from "next/server";
import { defaultClassroomContent, normalizeClassroomContent } from "../../../shared/classroom-content";

export const dynamic = "force-dynamic";

const canonicalContentUrl =
  "https://mr-poe-third-grade-jaguars.wizard1914.chatgpt.site/api/content";

export async function GET() {
  try {
    const response = await fetch(canonicalContentUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Content service returned ${response.status}`);
    const content = normalizeClassroomContent(await response.json());
    return NextResponse.json(content, {
      headers: { "cache-control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Falling back to bundled classroom content", error);
    return NextResponse.json(defaultClassroomContent, {
      headers: {
        "cache-control": "no-store, max-age=0",
        "x-classroom-content-source": "defaults",
      },
    });
  }
}
