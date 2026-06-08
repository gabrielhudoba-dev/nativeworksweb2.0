/**
 * Notion OAuth 2.0 helpers.
 *
 * Required env vars:
 *   NOTION_OAUTH_CLIENT_ID      — from Notion integration settings
 *   NOTION_OAUTH_CLIENT_SECRET  — from Notion integration settings
 *
 * The redirect URI is derived dynamically from the incoming request so the same
 * build works on localhost, staging, and production without extra env vars.
 * You must register every origin you use in the Notion integration's OAuth settings.
 */

const NOTION_OAUTH_AUTH_URL = "https://api.notion.com/v1/oauth/authorize";
const NOTION_OAUTH_TOKEN_URL = "https://api.notion.com/v1/oauth/token";

/** Pass the full redirect URI derived from the current request origin. */
export function getNotionAuthUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: process.env.NOTION_OAUTH_CLIENT_ID!,
    response_type: "code",
    owner: "user",
    redirect_uri: redirectUri,
  });
  return `${NOTION_OAUTH_AUTH_URL}?${params.toString()}`;
}

export type NotionTokenResponse = {
  access_token: string;
  token_type: string;
  bot_id: string;
  workspace_id: string;
  workspace_name: string;
  owner: {
    type: "user";
    user: {
      id: string;
      name: string;
      avatar_url: string | null;
      person?: { email: string };
    };
  };
};

export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<NotionTokenResponse> {
  const credentials = Buffer.from(
    `${process.env.NOTION_OAUTH_CLIENT_ID}:${process.env.NOTION_OAUTH_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(NOTION_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion OAuth token exchange failed (${res.status}): ${body}`);
  }

  return res.json() as Promise<NotionTokenResponse>;
}
