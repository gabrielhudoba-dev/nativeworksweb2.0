"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getProposalBySlug, updateProposal } from "@/lib/notion-proposals";

/**
 * Interim signing: records a typed-signature artifact and marks the proposal
 * signed. Task 9 replaces this with Google Workspace eSignature (the
 * `5_proposal_signatures` table + this flow are the seam it plugs into).
 */
export async function signAction(formData: FormData): Promise<void> {
  const slug = formData.get("slug") as string;
  const fullName = ((formData.get("fullName") as string) ?? "").trim();
  const proposal = await getProposalBySlug(slug);
  if (!proposal || !fullName) return;

  const now = new Date().toISOString();

  await supabaseAdmin.from("5_proposal_signatures").insert({
    notion_proposal_id: proposal.notionPageId,
    provider: "interim_typed",
    status: "signed",
  });

  await supabaseAdmin.from("5_proposal_events").insert({
    notion_proposal_id: proposal.notionPageId,
    event_type: "signed",
    payload: { slug, signedBy: fullName },
  });

  await updateProposal(proposal.notionPageId, { status: "signed", signedAt: now });

  redirect(`/p/${slug}`);
}
