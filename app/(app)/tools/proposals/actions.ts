"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { requireCreator } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/email";
import { generateSlug, generateAccessToken } from "@/lib/tokens";
import {
  createProposal,
  deleteProposal,
  getProposal,
  saveBlocks,
  updateProposal,
  countClientProposals,
  type ProposalStatus,
} from "@/lib/notion-proposals";
import { findClientsByName, createClient } from "@/lib/notion-clients";
import { defaultDocument, type SaveBlockInput } from "../blocks/types";

/** Public origin of the current request (works on localhost and production). */
async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Append-only audit event in Supabase (no Notion round-trip per event). */
async function logEvent(
  notionProposalId: string,
  eventType: string,
  payload: Record<string, unknown> = {}
): Promise<void> {
  await supabaseAdmin.from("5_proposal_events").insert({
    notion_proposal_id: notionProposalId,
    event_type: eventType,
    payload,
  });
}

/** Search the Company (Clients) DB for the new-proposal client picker. */
export async function searchClientsAction(
  query: string
): Promise<Array<{ pageId: string; companyName: string }>> {
  await requireCreator();
  if (query.trim().length < 1) return [];
  const clients = await findClientsByName(query.trim());
  return clients.map((c) => ({ pageId: c.notionPageId, companyName: c.companyName }));
}

/** Default proposal number for a client = existing count + 1. */
export async function clientProposalNumberAction(clientPageId: string): Promise<number> {
  await requireCreator();
  return (await countClientProposals(clientPageId)) + 1;
}

export type NewProposalInput = {
  title: string;
  client:
    | { mode: "existing"; pageId: string; companyName: string }
    | {
        mode: "new";
        companyName: string;
        pocName?: string;
        pocEmail?: string;
        pocPhone?: string;
      };
};

/**
 * Create a new draft proposal. Client comes first: link an existing Company or
 * create a new one (only company name required). The 3 locked blocks are seeded
 * up front with the client's name in the header. Then open the editor.
 * Auth is re-checked here — actions are reachable by direct POST.
 */
export async function createProposalAction(input: NewProposalInput): Promise<void> {
  const session = await requireCreator();

  // 1. Resolve the client → a Company page id + display name.
  let clientPageId: string;
  let companyName: string;
  if (input.client.mode === "existing") {
    clientPageId = input.client.pageId;
    companyName = input.client.companyName;
  } else {
    companyName = input.client.companyName.trim() || "New client";
    const created = await createClient({
      companyName,
      legalName: "",
      regId: "",
      vatId: "",
      address: "",
      billingEmail: "",
      signatoryName: "",
      contactName: input.client.pocName?.trim() ?? "",
      contactEmail: input.client.pocEmail?.trim() ?? "",
      contactPhone: input.client.pocPhone?.trim() ?? "",
    });
    clientPageId = created.notionPageId;
  }

  const title = input.title.trim() || companyName;

  // 2. Create the proposal (page + inline Blocks DB) and link the client.
  const proposal = await createProposal({
    title,
    slug: generateSlug(),
    accessToken: generateAccessToken(),
    createdByNotionUserId: session.notionUserId,
  });
  await updateProposal(proposal.notionPageId, { clientPageId });

  // 3. Seed the locked blocks. Header carries the client name, and its "project
  //    title" heading is the proposal name (the two stay linked — see saveProposalAction).
  const seed = defaultDocument();
  const header = seed.find((b) => b.blockType === "header");
  if (header) {
    header.clientName = companyName;
    header.heading = title;
  }
  await saveBlocks(
    proposal.blocksDatabaseId,
    proposal.notionPageId,
    seed.map((b, i) => ({
      notionPageId: "",
      blockType: b.blockType,
      locked: b.locked,
      sortOrder: i,
      heading: b.heading,
      body: b.body,
      clientName: b.clientName,
      subtitle: b.subtitle,
      items: b.items,
      stagesJson: b.blockType === "process" ? JSON.stringify(b.stages) : "",
      services: b.services.map((s, j) => ({
        notionPageId: "",
        title: s.title,
        desc: s.desc,
        price: s.price,
        duration: s.duration,
        sortOrder: j,
      })),
    }))
  );

  await logEvent(proposal.notionPageId, "viewed", { kind: "created" });
  revalidatePath("/tools");
  redirect(`/tools/proposals/${proposal.notionPageId}/edit`);
}

/** Reconciliation map: client temp id → persisted Notion id, returned to the editor. */
export type SaveResult =
  | {
      ok: true;
      blocks: Array<{
        clientId: string;
        notionPageId: string;
        services: Array<{ clientId: string; notionPageId: string }>;
      }>;
    }
  | { ok: false; error: string };

/**
 * Whole-document save: upsert present blocks, delete missing, re-sequence order.
 * Returns the persisted ids zipped back to the editor's client ids so temp ids
 * become real and subsequent saves stay stable.
 */
export async function saveProposalAction(
  proposalPageId: string,
  blocksDatabaseId: string,
  blocks: SaveBlockInput[]
): Promise<SaveResult> {
  await requireCreator();
  try {
    const refs = await saveBlocks(
      blocksDatabaseId,
      proposalPageId,
      blocks.map((b) => ({
        notionPageId: b.notionPageId,
        blockType: b.blockType,
        locked: b.locked,
        sortOrder: 0,
        heading: b.heading,
        body: b.body,
        clientName: b.clientName,
        subtitle: b.subtitle,
        items: b.items,
        stagesJson: b.stagesJson,
        services: b.services.map((s, i) => ({
          notionPageId: s.notionPageId,
          title: s.title,
          desc: s.desc,
          price: s.price,
          duration: s.duration,
          sortOrder: i,
        })),
      }))
    );

    // Keep the proposal name linked to the header's project title.
    const header = blocks.find((b) => b.blockType === "header");
    const projectTitle = header?.heading.trim();
    if (projectTitle) {
      await updateProposal(proposalPageId, { title: projectTitle });
    }

    // Zip persisted ids (input order) back onto the editor's stable client ids.
    const mapped = blocks.map((b, i) => ({
      clientId: b.clientId,
      notionPageId: refs[i]?.notionPageId ?? b.notionPageId,
      services: b.services.map((s, j) => ({
        clientId: s.clientId,
        notionPageId: refs[i]?.serviceIds[j] ?? s.notionPageId,
      })),
    }));

    return { ok: true, blocks: mapped };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Save failed";
    return { ok: false, error };
  }
}

/**
 * Archive (delete) a proposal in Notion. Navigation is handled client-side
 * (the caller redirects to /tools after this resolves).
 */
export async function deleteProposalAction(proposalPageId: string): Promise<void> {
  await requireCreator();
  await deleteProposal(proposalPageId);
  revalidatePath("/tools");
}

/** Move a proposal through its lifecycle, stamping the matching timestamp. */
export async function transitionStatusAction(
  proposalPageId: string,
  status: ProposalStatus
): Promise<void> {
  await requireCreator();
  const now = new Date().toISOString();
  const stamp: Record<ProposalStatus, Record<string, string>> = {
    draft: {},
    sent: { sentAt: now },
    viewed: { viewedAt: now },
    call_booked: {},
    accepted: { acceptedAt: now },
    verified: {},
    signed: { signedAt: now },
    declined: {},
  };
  await updateProposal(proposalPageId, { status, ...stamp[status] });
  await logEvent(proposalPageId, status === "sent" ? "sent" : status, {});
  revalidatePath("/tools");
  revalidatePath(`/tools/proposals/${proposalPageId}/edit`);
}

// ─── Email share ──────────────────────────────────────────────────────────────

/** Substitutes {{placeholder}} tokens in a template string. */
function applyTemplate(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

/**
 * Fetch the proposal email template from Supabase (0_global, section=proposal_email)
 * and return it with placeholders substituted. Also ensures the share URL exists.
 * Called client-side when the email tab is first opened.
 */
export async function getShareEmailTemplateAction(proposalPageId: string): Promise<{
  subject: string;
  body: string;
  shareUrl: string;
}> {
  await requireCreator();

  // Ensure share URL is generated (draft → sent if needed).
  const { shareUrl } = await shareProposalAction(proposalPageId);

  const proposal = await getProposal(proposalPageId);
  const title = proposal?.title ?? "";
  const clientName = ""; // Could be enriched from Notion client relation later.

  // Fetch template rows from Supabase (service role — not public-read).
  const { data } = await supabaseAdmin
    .from("0_global")
    .select("key, value")
    .eq("section", "proposal_email");

  const rows: Record<string, string> = Object.fromEntries(
    (data ?? []).map(({ key, value }: { key: string; value: string }) => [key, value])
  );

  const vars = { proposal_title: title, client_name: clientName, share_url: shareUrl };
  return {
    subject: applyTemplate(rows["subject"] ?? "Cenová ponuka: {{proposal_title}}", vars),
    body:    applyTemplate(rows["body"]    ?? "{{share_url}}", vars),
    shareUrl,
  };
}

/** Send the proposal link by email using Resend. */
export async function sendProposalEmailAction(
  proposalPageId: string,
  to: string,
  subject: string,
  body: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireCreator();
  try {
    await sendEmail({ to, subject, text: body });
    await logEvent(proposalPageId, "viewed", { kind: "email_sent", to });
    return { ok: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Could not send email";
    return { ok: false, error };
  }
}

/**
 * Mark a proposal as shareable: build the public link from the request origin,
 * persist it, and flip draft → sent (stamping Sent At) the first time. Returns
 * the link for the editor to copy.
 */
export async function shareProposalAction(
  proposalPageId: string
): Promise<{ shareUrl: string }> {
  await requireCreator();
  const proposal = await getProposal(proposalPageId);
  if (!proposal) throw new Error("Proposal not found");

  const shareUrl = `${await requestOrigin()}/p/${proposal.slug}`;

  if (proposal.status === "draft") {
    await updateProposal(proposalPageId, {
      status: "sent",
      shareUrl,
      sentAt: new Date().toISOString(),
    });
    await logEvent(proposalPageId, "sent", { shareUrl });
  } else if (proposal.shareUrl !== shareUrl) {
    await updateProposal(proposalPageId, { shareUrl });
  }

  revalidatePath("/tools");
  return { shareUrl };
}
