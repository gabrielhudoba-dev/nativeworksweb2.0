import { getNotionAuthUrl } from "@/lib/notion-auth";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Logo } from "@/app/components/atoms/Logo";
import { Heading } from "@/app/components/atoms/Heading";
import { Text } from "@/app/components/atoms/Text";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Already logged in — go straight to studio
  const session = await getSession();
  if (session) redirect("/tools");

  const { error } = await searchParams;

  // Derive redirect URI from the incoming request so the same build works
  // on localhost and production without extra env vars.
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const redirectUri = `${proto}://${host}/api/auth/notion`;
  const authUrl = getNotionAuthUrl(redirectUri);

  return (
    <main className="min-h-screen flex items-center justify-center px-s4">
      <div className="w-full max-w-form flex flex-col items-center gap-s10 text-center mb-[80px]">
        <Logo size="md" />

        <div className="flex flex-col gap-0">
          <Heading variant="h3">Native Tools</Heading>
          <Text variant="p2" className="text-prim/60 max-w-[344px] mx-auto">
            Sign in with your Notion account to access the Native Tools. Only Native Works team members can access this area.
          </Text>
        </div>

        <div className="flex flex-col items-center gap-s2">
          <a
            href={authUrl}
            className="inline-flex items-center justify-center gap-s2 bg-prim text-white rounded-pill px-s4 h-s6 font-body text-l1 font-medium transition-opacity hover:opacity-80"
          >
            <svg width="20" height="20" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
              <path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.43c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.803-6.993 7.193L17.11 99.97c-4.083.193-6.053-.387-8.19-3.107L2.037 88.633C.48 86.493 0 84.743 0 82.8V11.113C0 7.217 1.553 4.5 6.017 4.313z" />
            </svg>
            Continue with Notion
          </a>
          {error && (
            <Text variant="p3" className="text-error">
              {error === "access_denied"
                ? "Access was denied. Please try again."
                : "Sign in failed. Please try again."}
            </Text>
          )}
          {process.env.NODE_ENV !== "production" && (
            <a
              href="/api/auth/dev-login"
              className="font-body text-l3 text-prim/30 hover:text-prim/60 transition-colors underline underline-offset-2"
            >
              Dev bypass (skip Notion OAuth)
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
