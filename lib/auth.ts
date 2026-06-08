import "server-only";
import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "./session";

/** Use in server components and server actions to get the current session.
 *  Redirects to /login if no valid session exists. */
export async function requireCreator(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

/** Returns session or null — does not redirect. Use for conditional rendering. */
export async function getCreator(): Promise<SessionPayload | null> {
  return getSession();
}
