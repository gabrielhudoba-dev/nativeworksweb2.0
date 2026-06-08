import { type NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

/**
 * DEV-ONLY login bypass — creates a mock session without going through Notion OAuth.
 * ONLY works when NODE_ENV !== "production". Returns 404 in production.
 *
 * Usage: GET /api/auth/dev-login
 */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await createSession({
    notionUserId: "dev-user",
    email: "dev@nativeworks.eu",
    name: "Dev User",
    avatar: null,
  });

  const origin = new URL(req.url).origin;
  return NextResponse.redirect(`${origin}/tools`, { status: 307 });
}
