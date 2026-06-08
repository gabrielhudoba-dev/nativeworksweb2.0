"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getProposalBySlug, updateProposal } from "@/lib/notion-proposals";
import { getClient, createClient, updateClient } from "@/lib/notion-clients";

/**
 * Client confirmed/filled billing & legal data. Notion is canonical, so we write
 * straight back to the Company (Clients) DB: update the linked company if there is
 * one, otherwise create it and link it to the proposal. Then status → verified
 * and on to signing.
 */
export async function verifyAction(formData: FormData): Promise<void> {
  const slug = formData.get("slug") as string;
  const proposal = await getProposalBySlug(slug);
  if (!proposal) return;

  const get = (k: string) => ((formData.get(k) as string) ?? "").trim();
  const billing = {
    companyName: get("companyName"),
    legalName: get("legalName"),
    regId: get("regId"),
    vatId: get("vatId"),
    address: get("address"),
    billingEmail: get("billingEmail"),
    signatoryName: get("signatoryName"),
  };

  if (proposal.clientPageId) {
    await updateClient(proposal.clientPageId, billing);
  } else {
    const created = await createClient({
      ...billing,
      contactName: get("contactName"),
      contactEmail: get("contactEmail"),
      contactPhone: get("contactPhone"),
    });
    await updateProposal(proposal.notionPageId, { clientPageId: created.notionPageId });
  }

  await supabaseAdmin.from("5_proposal_events").insert({
    notion_proposal_id: proposal.notionPageId,
    event_type: "data_verified",
    payload: { slug, company: billing.companyName },
  });

  await updateProposal(proposal.notionPageId, { status: "verified" });

  redirect(`/p/${slug}/sign`);
}
