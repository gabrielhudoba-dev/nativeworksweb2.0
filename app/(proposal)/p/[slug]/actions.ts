"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getProposalBySlug, updateProposal } from "@/lib/notion-proposals";

/**
 * Public, unauthenticated: record that a client opened the proposal.
 * Logs an audit event and bumps status sent → viewed (never downgrades a more
 * advanced status). Looks the proposal up by slug server-side — the client only
 * passes the slug, never a trusted status.
 */
export async function markViewedAction(slug: string): Promise<void> {
  const proposal = await getProposalBySlug(slug);
  if (!proposal) return;

  await supabaseAdmin.from("5_proposal_events").insert({
    notion_proposal_id: proposal.notionPageId,
    event_type: "viewed",
    payload: { slug },
  });

  if (proposal.status === "sent") {
    await updateProposal(proposal.notionPageId, {
      status: "viewed",
      viewedAt: new Date().toISOString(),
    });
  }
}

/** Client chose "Accept" — log intent and move to the data-verify step. */
export async function acceptAction(formData: FormData): Promise<void> {
  const slug = formData.get("slug") as string;
  const proposal = await getProposalBySlug(slug);
  if (!proposal) return;

  await supabaseAdmin.from("5_proposal_events").insert({
    notion_proposal_id: proposal.notionPageId,
    event_type: "accept_clicked",
    payload: { slug },
  });

  redirect(`/p/${slug}/verify`);
}
