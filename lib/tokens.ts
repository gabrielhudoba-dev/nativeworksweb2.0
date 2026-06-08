import { randomBytes } from "crypto";

/** Short unguessable base62 slug for public URLs, e.g. /p/aB3kR9x */
export function generateSlug(bytes = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const buf = randomBytes(bytes);
  return Array.from(buf)
    .map((b) => chars[b % 62])
    .join("");
}

/** Longer token for defense-in-depth capability check (not in the URL) */
export function generateAccessToken(): string {
  return generateSlug(24);
}
