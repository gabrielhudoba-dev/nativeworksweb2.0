"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getProposalBySlug, getProposalBlocks } from "@/lib/notion-proposals";
import { getClient } from "@/lib/notion-clients";
import {
  getDocuments,
  recordDocumentView,
  markDocumentSigned,
  detectServices,
  generateSowRef,
  clientHasSignedMsa,
  getClientDriveFolderId,
  type PreparedDocument,
  type DocumentData,
} from "@/lib/esign";

// ── Fetch current documents ───────────────────────────────────────────────────

export async function getDocumentsAction(slug: string): Promise<PreparedDocument[]> {
  const proposal = await getProposalBySlug(slug);
  if (!proposal) return [];
  return getDocuments(proposal.notionPageId);
}

// ── Record view ───────────────────────────────────────────────────────────────

export async function viewDocumentAction(docId: string, slug: string): Promise<void> {
  await recordDocumentView(docId);
  const proposal = await getProposalBySlug(slug);
  if (proposal) {
    await supabaseAdmin.from("5_proposal_events").insert({
      notion_proposal_id: proposal.notionPageId,
      event_type: "sign_started",
      payload: { slug, docId },
    });
  }
  revalidatePath(`/p/${slug}/documents`);
}

// ── Confirm signed ────────────────────────────────────────────────────────────

export async function confirmSignedAction(docId: string, slug: string): Promise<void> {
  const proposal = await getProposalBySlug(slug);
  if (!proposal) return;
  await markDocumentSigned(docId, proposal.notionPageId);
  await supabaseAdmin.from("5_proposal_events").insert({
    notion_proposal_id: proposal.notionPageId,
    event_type: "signed",
    payload: { slug, docId },
  });
  revalidatePath(`/p/${slug}/documents`);
}

// ── Build full DocumentData from Notion ──────────────────────────────────────

export async function buildDocumentData(slug: string): Promise<DocumentData | null> {
  const proposal = await getProposalBySlug(slug);
  if (!proposal) return null;

  const client = proposal.clientPageId
    ? await getClient(proposal.clientPageId).catch(() => null)
    : null;

  // Detect services from proposal pricing items (service names in Notion)
  let serviceNames: string[] = [];
  if (proposal.blocksDatabaseId) {
    try {
      const blocks = await getProposalBlocks(proposal.blocksDatabaseId, proposal.notionPageId);
      // Collect headings from pricing blocks to detect service modules
      serviceNames = blocks
        .filter((b) => b.blockType === "pricing")
        .map((b) => b.heading ?? "")
        .filter(Boolean);
    } catch { /* non-critical */ }
  }

  const services = detectServices(serviceNames);
  const isExistingClient = client
    ? await clientHasSignedMsa(proposal.clientPageId ?? "").catch(() => false)
    : false;

  // Look up stored Drive folder for this client across previous proposals
  const clientDriveFolderId = await getClientDriveFolderId(proposal.notionPageId)
    .catch(() => null) ?? undefined;

  const sowRef = await generateSowRef();

  return {
    proposalTitle:      proposal.title ?? slug,
    proposalId:         proposal.notionPageId,
    sowRef,
    msaDate:            isExistingClient ? undefined : new Date().toLocaleDateString("sk-SK"),
    companyName:        client?.companyName  ?? "",
    legalName:          client?.legalName    ?? client?.companyName ?? "",
    regId:              client?.regId        ?? "",
    vatId:              client?.vatId        ?? "",
    address:            client?.address      ?? "",
    billingEmail:       client?.billingEmail ?? client?.contactEmail ?? "",
    signatoryName:      client?.signatoryName ?? client?.contactName ?? "",
    contactName:        client?.contactName  ?? "",
    contactEmail:       client?.contactEmail ?? "",
    services,
    isExistingClient,
    clientDriveFolderId,
  };
}

// ── Trigger document preparation (idempotent) ─────────────────────────────────

export async function triggerDocumentPrepAction(slug: string): Promise<PreparedDocument[]> {
  const proposal = await getProposalBySlug(slug);
  if (!proposal) throw new Error("Proposal not found");

  const existing = await getDocuments(proposal.notionPageId);
  if (existing.length > 0) return existing;

  const docData = await buildDocumentData(slug);
  if (!docData) throw new Error("Could not load document data");

  const { prepareDocuments } = await import("@/lib/esign");
  const docs = await prepareDocuments(proposal.notionPageId, docData);

  revalidatePath(`/p/${slug}/documents`);
  return docs;
}
