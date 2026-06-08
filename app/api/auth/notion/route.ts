import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/notion-auth";
import { createSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/login?error=access_denied", req.url));
  }

  // Reconstruct the redirect URI from the actual request origin so it matches
  // whatever was used in the authorize URL (localhost or production).
  const redirectUri = `${new URL(req.url).origin}/api/auth/notion`;

  let token;
  try {
    token = await exchangeCodeForToken(code, redirectUri);
  } catch (err) {
    console.error("Notion OAuth error:", err);
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }

  const user = token.owner.user;
  const email = user.person?.email ?? null;
  const notionUserId = user.id;

  // Upsert user into Supabase 5_users
  await supabaseAdmin.from("5_users").upsert(
    {
      notion_user_id: notionUserId,
      email,
      name: user.name,
      avatar: user.avatar_url,
      access_token: token.access_token,
    },
    { onConflict: "notion_user_id" }
  );

  // Create session cookie
  await createSession({
    notionUserId,
    email,
    name: user.name,
    avatar: user.avatar_url,
  });

  return NextResponse.redirect(new URL("/tools", req.url));
}
