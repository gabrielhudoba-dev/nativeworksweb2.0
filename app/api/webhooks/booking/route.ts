import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getProposalBySlug, updateProposal } from "@/lib/notion-proposals";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/** Verify Cal.com's HMAC-SHA256 signature over the raw body. */
function verifySignature(raw: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(signature, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function findSlug(payload: Record<string, unknown>): string | null {
  // Cal nests the booking under payload.payload; metadata carries our slug.
  const inner = (payload.payload ?? payload) as Record<string, unknown>;
  const meta = (inner.metadata ?? {}) as Record<string, unknown>;
  return typeof meta.proposalSlug === "string" ? meta.proposalSlug : null;
}

export async function POST(req: NextRequest) {
  const raw = await req.text();

  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  if (secret) {
    const sig = req.headers.get("x-cal-signature-256");
    if (!verifySignature(raw, sig, secret)) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (body.triggerEvent !== "BOOKING_CREATED") {
    return NextResponse.json({ ok: true, ignored: body.triggerEvent });
  }

  const slug = findSlug(body);
  if (!slug) {
    return NextResponse.json({ ok: true, note: "no proposalSlug in metadata" });
  }

  const proposal = await getProposalBySlug(slug);
  if (!proposal) {
    return NextResponse.json({ ok: true, note: "proposal not found" });
  }

  await supabaseAdmin.from("5_proposal_events").insert({
    notion_proposal_id: proposal.notionPageId,
    event_type: "call_booked",
    payload: { slug },
  });

  // Don't downgrade a proposal that's already further along.
  if (["draft", "sent", "viewed"].includes(proposal.status)) {
    await updateProposal(proposal.notionPageId, { status: "call_booked" });
  }

  return NextResponse.json({ ok: true });
}
