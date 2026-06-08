/**
 * lib/esign.ts — Modular contract assembly + Google Drive integration
 *
 * Architecture (per research):
 *   New client:      NDA + MSA + DPA + SOW (assembled from service modules)
 *   Existing client: SOW only (modules based on proposal services)
 *   Mid-project:     Change Order against existing SOW
 *   MSA update:      Amendment or Addendum (manual trigger)
 *
 * Drive folder structure per client:
 *   Native Works — Clients/
 *     {Company Name} — {IČO}/
 *       _Agreements/           ← NDA, MSA, DPA (signed once per client)
 *       {Year} — {Project}/    ← SOW + service schedule annexes
 *
 * Required env vars:
 *   GOOGLE_SERVICE_ACCOUNT_JSON   — base64 or raw JSON
 *   GOOGLE_DRIVE_ROOT_FOLDER      — ID of "Native Works — Clients" root folder
 */

import "server-only";
import { readFileSync } from "fs";
import { resolve } from "path";
import { google } from "googleapis";
import { supabaseAdmin } from "./supabase-admin";

// ── Types ─────────────────────────────────────────────────────────────────────

export type DocumentStatus =
  | "preparing" | "created" | "sent" | "viewed" | "signed" | "declined" | "error";

export type DocumentKind =
  | "nda" | "msa" | "dpa" | "sow" | "change_order" | "addendum" | "amendment";

export type ServiceModule =
  | "web" | "brand" | "ux" | "design_system" | "retainer" | "consulting";

export interface PreparedDocument {
  id: string;
  notionProposalId: string;
  documentName: string;
  kind: DocumentKind;
  driveFileId: string | null;
  viewUrl: string | null;
  signUrl: string | null;
  status: DocumentStatus;
  viewedAt: string | null;
  signedAt: string | null;
  createdAt: string;
  isRelationshipDoc: boolean; // NDA/MSA/DPA — signed once per client, not per project
}

export interface DocumentData {
  // Proposal
  proposalTitle: string;
  proposalId: string;
  sowRef: string;           // e.g. "NW-2025-001"
  msaDate?: string;         // for existing clients — date of existing MSA
  // Client
  companyName: string;
  legalName: string;
  regId: string;
  vatId: string;
  address: string;
  billingEmail: string;
  signatoryName: string;
  contactName: string;
  contactEmail: string;
  // Project
  totalFee?: string;
  hourlyRate?: string;
  retainerHours?: string;
  retainerFee?: string;
  // Detected services (from proposal pricing/blocks)
  services: ServiceModule[];
  // Client relationship
  isExistingClient: boolean; // true = has signed MSA, generate SOW only
  clientDriveFolderId?: string; // existing Drive folder for this client
}

// ── Google auth ───────────────────────────────────────────────────────────────

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? "";
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not configured");
  const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf-8");
  return new google.auth.GoogleAuth({
    credentials: JSON.parse(json),
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/documents",
    ],
  });
}

// ── Template loading ──────────────────────────────────────────────────────────

const TEMPLATE_DIR = resolve(process.cwd(), "scripts", "templates");

function loadTemplate(name: string): string {
  return readFileSync(resolve(TEMPLATE_DIR, `${name}.md`), "utf-8");
}

const SERVICE_MODULE_MAP: Record<ServiceModule, string> = {
  web:           "module_web",
  brand:         "module_brand",
  ux:            "module_ux",
  design_system: "module_design_system",
  retainer:      "module_retainer",
  consulting:    "module_ux", // fallback — consulting uses similar structure
};

// ── Service detection from proposal pricing items ─────────────────────────────

const SERVICE_KEYWORDS: Record<ServiceModule, string[]> = {
  web:           ["web", "website", "landing", "frontend", "next", "react", "develop", "code"],
  brand:         ["brand", "logo", "identity", "visual", "mark", "logotype"],
  ux:            ["ux", "ui", "user experience", "interface", "research", "prototype", "wireframe", "figma"],
  design_system: ["design system", "component", "token", "library", "storybook"],
  retainer:      ["retainer", "maintenance", "support", "ongoing", "monthly"],
  consulting:    ["strategy", "consulting", "consult", "workshop", "audit"],
};

export function detectServices(serviceNames: string[]): ServiceModule[] {
  const detected = new Set<ServiceModule>();
  for (const name of serviceNames) {
    const lower = name.toLowerCase();
    for (const [module, keywords] of Object.entries(SERVICE_KEYWORDS) as [ServiceModule, string[]][]) {
      if (keywords.some((kw) => lower.includes(kw))) {
        detected.add(module);
      }
    }
  }
  // Default: if nothing detected, include web (most common)
  if (detected.size === 0) detected.add("web");
  return Array.from(detected);
}

// ── Placeholder substitution ──────────────────────────────────────────────────

function applyPlaceholders(text: string, data: DocumentData & Record<string, string>): string {
  const serviceScheduleList = data.services
    .map((s, i) => `     Schedule ${String.fromCharCode(65 + i)}: ${serviceModuleLabel(s)}`)
    .join("\n");

  const replacements: Record<string, string> = {
    "{{date}}":                 new Date().toLocaleDateString("sk-SK"),
    "{{proposal_title}}":       data.proposalTitle,
    "{{sow_ref}}":              data.sowRef,
    "{{msa_date}}":             data.msaDate ?? new Date().toLocaleDateString("sk-SK"),
    "{{legal_name}}":           data.legalName || data.companyName,
    "{{company_name}}":         data.companyName,
    "{{reg_id}}":               data.regId,
    "{{vat_id}}":               data.vatId,
    "{{address}}":              data.address,
    "{{billing_email}}":        data.billingEmail,
    "{{signatory_name}}":       data.signatoryName,
    "{{contact_name}}":         data.contactName || data.signatoryName,
    "{{contact_email}}":        data.contactEmail || data.billingEmail,
    "{{nw_contact_name}}":      "Gabriel Hudoba",
    "{{total_fee}}":            data.totalFee ?? "As per Proposal",
    "{{hourly_rate}}":          data.hourlyRate ?? "120",
    "{{retainer_hours}}":       data.retainerHours ?? "20",
    "{{retainer_fee}}":         data.retainerFee ?? "As per Proposal",
    "{{service_schedule_list}}": serviceScheduleList,
    // Change order placeholders (left blank for manual fill)
    "{{change_order_ref}}":     `${data.sowRef}-CO-001`,
    "{{change_description}}":   "[Describe the change]",
    "{{change_reason}}":        "[Describe the reason]",
    "{{scope_impact}}":         "[Describe scope impact]",
    "{{original_completion}}":  "[Original date]",
    "{{revised_completion}}":   "[Revised date]",
    "{{timeline_delay}}":       "[N]",
    "{{original_fee}}":         data.totalFee ?? "[Original fee]",
    "{{additional_fee}}":       "[Additional fee]",
    "{{new_total_fee}}":        "[New total]",
    "{{co_payment_terms}}":     "Additional fee due within 14 days of this Change Order.",
  };

  return Object.entries(replacements).reduce(
    (acc, [k, v]) => acc.replaceAll(k, v),
    text,
  );
}

function serviceModuleLabel(m: ServiceModule): string {
  const labels: Record<ServiceModule, string> = {
    web:           "Web Design & Development",
    brand:         "Brand Identity",
    ux:            "UX / Product Design",
    design_system: "Design System",
    retainer:      "Retainer / Maintenance",
    consulting:    "Strategy & Consulting",
  };
  return labels[m];
}

// ── Document plan — which docs to generate ────────────────────────────────────

interface DocSpec {
  kind: DocumentKind;
  name: string;
  isRelationshipDoc: boolean;
  templateParts: string[]; // template file names to concatenate
}

function buildDocPlan(data: DocumentData): DocSpec[] {
  const docs: DocSpec[] = [];

  if (!data.isExistingClient) {
    // New client gets the full relationship stack
    docs.push({
      kind: "nda",
      name: "01 — Mutual NDA",
      isRelationshipDoc: true,
      templateParts: ["nda"],
    });
    docs.push({
      kind: "msa",
      name: "02 — Master Services Agreement",
      isRelationshipDoc: true,
      templateParts: ["msa"],
    });
    docs.push({
      kind: "dpa",
      name: "03 — Data Processing Agreement (GDPR)",
      isRelationshipDoc: true,
      templateParts: ["dpa"],
    });
  }

  // SOW — always generated, assembled from base + detected service modules
  const sowModules = data.services.map((s) => SERVICE_MODULE_MAP[s]);
  docs.push({
    kind: "sow",
    name: `${data.isExistingClient ? "01" : "04"} — Statement of Work — ${data.proposalTitle}`,
    isRelationshipDoc: false,
    templateParts: ["sow_base", ...sowModules],
  });

  return docs;
}

// ── Drive folder management ───────────────────────────────────────────────────

async function getOrCreateFolder(
  drive: ReturnType<typeof google.drive>,
  name: string,
  parentId: string,
): Promise<string> {
  // Search for existing folder
  const search = await drive.files.list({
    q: `name = '${name.replace(/'/g, "\\'")}' and '${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
    pageSize: 1,
  });
  if (search.data.files?.[0]?.id) return search.data.files[0].id;

  // Create new folder
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });
  return res.data.id!;
}

async function ensureClientFolders(
  drive: ReturnType<typeof google.drive>,
  data: DocumentData,
): Promise<{ clientFolderId: string; agreementsFolderId: string; projectFolderId: string }> {
  const rootId = process.env.GOOGLE_DRIVE_ROOT_FOLDER;
  if (!rootId) throw new Error("GOOGLE_DRIVE_ROOT_FOLDER not configured");

  const clientFolderName = `${data.companyName}${data.regId ? ` — ${data.regId}` : ""}`;
  const year = new Date().getFullYear();
  const projectFolderName = `${year} — ${data.proposalTitle}`;

  const clientFolderId = data.clientDriveFolderId
    ?? await getOrCreateFolder(drive, clientFolderName, rootId);

  const agreementsFolderId = await getOrCreateFolder(drive, "_Agreements", clientFolderId);
  const projectFolderId    = await getOrCreateFolder(drive, projectFolderName, clientFolderId);

  return { clientFolderId, agreementsFolderId, projectFolderId };
}

// ── Upload a document to Google Docs ─────────────────────────────────────────

async function uploadDoc(
  drive: ReturnType<typeof google.drive>,
  docs: ReturnType<typeof google.docs>,
  name: string,
  content: string,
  folderId: string,
): Promise<{ fileId: string; viewUrl: string }> {
  // Create empty Google Doc
  const file = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.document",
      parents: [folderId],
    },
    fields: "id,webViewLink",
  });
  const fileId = file.data.id!;

  // Insert content via Docs batchUpdate
  await docs.documents.batchUpdate({
    documentId: fileId,
    requestBody: {
      requests: [{ insertText: { location: { index: 1 }, text: content } }],
    },
  });

  // Share as "anyone with link can view" (for client to open without Google account)
  await drive.permissions.create({
    fileId,
    requestBody: { type: "anyone", role: "reader" },
  });

  const viewUrl = `https://docs.google.com/document/d/${fileId}/edit`;
  return { fileId, viewUrl };
}

// ── Core: prepare all documents ───────────────────────────────────────────────

export async function prepareDocuments(
  notionProposalId: string,
  data: DocumentData,
): Promise<PreparedDocument[]> {
  const plan = buildDocPlan(data);

  // Insert placeholder rows immediately so UI renders skeleton
  const { data: inserted, error } = await supabaseAdmin
    .from("5_proposal_signatures")
    .insert(
      plan.map((spec) => ({
        notion_proposal_id: notionProposalId,
        provider: "google_drive",
        document_name: spec.name,
        status: "preparing",
      })),
    )
    .select();

  if (error || !inserted) throw new Error("Failed to insert document rows: " + error?.message);

  // Fire-and-forget async processing
  void processAll(inserted, plan, data, notionProposalId);

  return inserted.map(toDoc);
}

async function processAll(
  rows: Array<{ id: string; document_name: string | null }>,
  plan: DocSpec[],
  data: DocumentData,
  notionProposalId: string,
): Promise<void> {
  let auth: ReturnType<typeof getAuth>;
  try { auth = getAuth(); }
  catch (e) {
    console.error("[esign] Google auth failed:", e);
    await supabaseAdmin
      .from("5_proposal_signatures")
      .update({ status: "error" })
      .in("id", rows.map((r) => r.id));
    return;
  }

  const drive = google.drive({ version: "v3", auth });
  const docs  = google.docs ({ version: "v1", auth });

  // Ensure client folder structure exists
  let folders: Awaited<ReturnType<typeof ensureClientFolders>>;
  try {
    folders = await ensureClientFolders(drive, data);
    // Persist client folder ID back to Supabase for future use
    await supabaseAdmin.from("5_proposal_signatures").insert({
      notion_proposal_id: notionProposalId,
      provider: "google_drive_meta",
      document_name: "_CLIENT_FOLDER",
      status: "created",
      drive_file_id: folders.clientFolderId,
    });
  } catch (e) {
    console.error("[esign] Failed to create Drive folders:", e);
    await supabaseAdmin
      .from("5_proposal_signatures")
      .update({ status: "error" })
      .in("id", rows.map((r) => r.id));
    return;
  }

  for (const row of rows) {
    const spec = plan.find((p) => p.name === row.document_name);
    if (!spec) continue;

    try {
      // Assemble content from template parts
      const content = spec.templateParts
        .map((part) => loadTemplate(part))
        .map((tpl) => applyPlaceholders(tpl, data as DocumentData & Record<string, string>))
        .join("\n\n" + "─".repeat(57) + "\n\n");

      // Choose target folder: relationship docs → _Agreements, project docs → project folder
      const targetFolder = spec.isRelationshipDoc
        ? folders.agreementsFolderId
        : folders.projectFolderId;

      const { fileId, viewUrl } = await uploadDoc(drive, docs, spec.name, content, targetFolder);

      await supabaseAdmin
        .from("5_proposal_signatures")
        .update({ status: "created", drive_file_id: fileId, view_url: viewUrl })
        .eq("id", row.id);

    } catch (e) {
      console.error(`[esign] Failed to process ${spec.name}:`, e);
      await supabaseAdmin
        .from("5_proposal_signatures")
        .update({ status: "error" })
        .eq("id", row.id);
    }
  }
}

// ── Fetch documents ───────────────────────────────────────────────────────────

export async function getDocuments(notionProposalId: string): Promise<PreparedDocument[]> {
  const { data, error } = await supabaseAdmin
    .from("5_proposal_signatures")
    .select("*")
    .eq("notion_proposal_id", notionProposalId)
    .eq("provider", "google_drive")
    .neq("document_name", "_CLIENT_FOLDER")
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map(toDoc);
}

// ── Get stored client Drive folder ID ────────────────────────────────────────

export async function getClientDriveFolderId(
  notionProposalId: string,
): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("5_proposal_signatures")
    .select("drive_file_id")
    .eq("notion_proposal_id", notionProposalId)
    .eq("document_name", "_CLIENT_FOLDER")
    .single();
  return data?.drive_file_id ?? null;
}

// ── Check if client has existing MSA ─────────────────────────────────────────

export async function clientHasSignedMsa(clientNotionPageId: string): Promise<boolean> {
  // Look for any signed MSA across all proposals linked to this client
  // We join via 5_proposal_signatures by checking all proposal IDs for this client
  // Simplified: check if any MSA doc exists in signed state for proposals with this clientPageId
  // In practice this requires a join — for now we use a metadata row approach.
  const { data } = await supabaseAdmin
    .from("5_proposal_signatures")
    .select("id")
    .eq("provider", "google_drive")
    .like("document_name", "%Master Services Agreement%")
    .eq("status", "signed")
    .limit(1);

  // TODO: filter by client — currently checks globally. Enhance with client_id column.
  return (data?.length ?? 0) > 0;
}

// ── Record view / sign ────────────────────────────────────────────────────────

export async function recordDocumentView(docId: string): Promise<void> {
  const { data } = await supabaseAdmin
    .from("5_proposal_signatures")
    .select("status, viewed_at")
    .eq("id", docId)
    .single();
  if (!data || data.status === "signed") return;
  const update: Record<string, string> = {};
  if (!data.viewed_at) update.viewed_at = new Date().toISOString();
  if (data.status === "created") update.status = "viewed";
  if (Object.keys(update).length) {
    await supabaseAdmin.from("5_proposal_signatures").update(update).eq("id", docId);
  }
}

export async function markDocumentSigned(
  docId: string,
  notionProposalId: string,
): Promise<void> {
  const now = new Date().toISOString();
  await supabaseAdmin
    .from("5_proposal_signatures")
    .update({ status: "signed", signed_at: now, updated_at: now })
    .eq("id", docId);

  // Check if ALL non-relationship docs are signed → flip proposal status
  const { data: all } = await supabaseAdmin
    .from("5_proposal_signatures")
    .select("status, document_name")
    .eq("notion_proposal_id", notionProposalId)
    .eq("provider", "google_drive")
    .neq("document_name", "_CLIENT_FOLDER");

  const allSigned = all?.every((r) => r.status === "signed");
  if (allSigned) {
    const { updateProposal } = await import("./notion-proposals");
    await updateProposal(notionProposalId, { status: "signed", signedAt: now });
  }
}

// ── Generate SOW reference number ─────────────────────────────────────────────

export async function generateSowRef(): Promise<string> {
  // Count all SOWs ever created + 1
  const { count } = await supabaseAdmin
    .from("5_proposal_signatures")
    .select("*", { count: "exact", head: true })
    .like("document_name", "%Statement of Work%");

  const n = ((count ?? 0) + 1).toString().padStart(3, "0");
  return `NW-${new Date().getFullYear()}-${n}`;
}

// ── Row mapper ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDoc(row: any): PreparedDocument {
  const name: string = row.document_name ?? "Document";
  const kind: DocumentKind = name.includes("NDA") ? "nda"
    : name.includes("Master Services") ? "msa"
    : name.includes("Data Processing") ? "dpa"
    : name.includes("Statement of Work") ? "sow"
    : name.includes("Change Order") ? "change_order"
    : name.includes("Addendum") ? "addendum"
    : name.includes("Amendment") ? "amendment"
    : "sow";

  return {
    id:               row.id,
    notionProposalId: row.notion_proposal_id,
    documentName:     name,
    kind,
    driveFileId:      row.drive_file_id  ?? null,
    viewUrl:          row.view_url       ?? null,
    signUrl:          row.sign_url       ?? null,
    status:           row.status         ?? "preparing",
    viewedAt:         row.viewed_at      ?? null,
    signedAt:         row.signed_at      ?? null,
    createdAt:        row.created_at,
    isRelationshipDoc: ["nda", "msa", "dpa"].includes(kind),
  };
}
