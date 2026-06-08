import "server-only";

/**
 * Thin Resend adapter. Set RESEND_API_KEY + RESEND_FROM to enable.
 * Without the key the function throws — callers should catch and surface
 * a user-friendly error rather than crashing the whole request.
 */
export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  /** Plain-text body (also used as HTML fallback with <br> newlines). */
  text: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

  const from =
    process.env.RESEND_FROM ?? "Native Works <hello@nativeworks.eu>";

  // Simple HTML: wrap plain text in a <p> per paragraph.
  const html = text
    .split(/\n\n+/)
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
}
