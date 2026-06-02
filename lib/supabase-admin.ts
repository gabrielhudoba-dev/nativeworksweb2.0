import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});

/** Run raw SQL via the Management API (requires SUPABASE_ACCESS_TOKEN env var). */
export async function runSQL(sql: string): Promise<void> {
  const pat = process.env.SUPABASE_ACCESS_TOKEN;
  const ref = url.match(/https:\/\/([^.]+)/)?.[1];

  if (!pat || !ref) {
    throw new Error(
      "SUPABASE_ACCESS_TOKEN missing — add it from supabase.com/dashboard/account/tokens"
    );
  }

  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pat}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    throw new Error(`SQL failed (${res.status}): ${await res.text()}`);
  }
}
