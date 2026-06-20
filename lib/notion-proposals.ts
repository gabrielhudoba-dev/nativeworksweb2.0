/**
 * Notion adapter — Proposals + Proposal Blocks (inline, per-proposal) + Services databases.
 *
 * Hierarchy:
 *   Deals → Proposals (sub-DB under Deals page)
 *              └── Proposal page
 *                    └── Blocks DB (inline, created at proposal creation)
 *   Services (standalone, relates to Proposal)
 *
 * Required env vars:
 *   NOTION_TOKEN            — internal integration token
 *   NOTION_PROPOSALS_DB_ID  — Proposals database (lives under Deals)
 *   NOTION_SERVICES_DB_ID   — Services database (standalone, reusable)
 */

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

function headers() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProposalStatus =
  | "draft" | "sent" | "viewed" | "call_booked"
  | "accepted" | "verified" | "signed" | "declined";

export type BlockType =
  | "header" | "intro" | "pricing"
  | "description" | "benefits" | "scope" | "process"
  | "approach" | "impact" | "cta" | "partnership" | "about" | "footer"
  | "photo";

export type ProposalService = {
  notionPageId: string;
  title: string;
  desc: string;
  price: string;
  duration: string;
  allocation: string;
  sortOrder: number;
};

export type ProposalBlock = {
  notionPageId: string;
  blockType: BlockType;
  locked: boolean;
  sortOrder: number;
  heading: string;
  body: string;
  clientName: string;
  subtitle: string;
  items: string[];
  stagesJson: string;
  services: ProposalService[]; // pricing block only
};

export type Proposal = {
  notionPageId: string;
  blocksDatabaseId: string;  // ID of the inline Blocks DB inside this proposal page
  title: string;
  status: ProposalStatus;
  slug: string;
  accessToken: string;
  clientPageId: string | null;
  dealPageId: string | null;
  createdBy: string | null;
  currency: string;
  shareUrl: string | null;
  sentAt: string | null;
  viewedAt: string | null;
  acceptedAt: string | null;
  signedAt: string | null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function notionFetch(path: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const res = await fetch(`${NOTION_API}${path}`, {
    ...init,
    headers: { ...headers(), ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API ${res.status}: ${body}`);
  }
  return res.json() as Promise<Record<string, unknown>>;
}

function richText(value: string) {
  return [{ type: "text", text: { content: value ?? "" } }];
}

function plainText(prop: { rich_text?: Array<{ plain_text: string }> } | undefined): string {
  return prop?.rich_text?.map((t) => t.plain_text).join("") ?? "";
}

function titleText(prop: { title?: Array<{ plain_text: string }> } | undefined): string {
  return prop?.title?.map((t) => t.plain_text).join("") ?? "";
}

function dateStr(prop: { date?: { start: string } } | undefined): string | null {
  return prop?.date?.start ?? null;
}

// ─── Retry wrapper (Notion rate limit: 3 req/s) ───────────────────────────────

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429") && i < retries - 1) {
        await new Promise((r) => setTimeout(r, 400 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error("unreachable");
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

function pageToProposal(page: Record<string, unknown>): Proposal {
  const p = page.properties as Record<string, unknown>;
  return {
    notionPageId:   page.id as string,
    blocksDatabaseId: plainText(p["Blocks DB ID"] as never),
    title:          titleText(p["Name"] as never),
    status:         ((p["Status"] as { select?: { name: string } })?.select?.name ?? "draft") as ProposalStatus,
    slug:           plainText(p["Slug"] as never),
    accessToken:    plainText(p["Access Token"] as never),
    clientPageId:   (p["Client"] as { relation?: Array<{ id: string }> })?.relation?.[0]?.id ?? null,
    dealPageId:     (p["Deal"] as { relation?: Array<{ id: string }> })?.relation?.[0]?.id ?? null,
    createdBy:      (p["Created By"] as { people?: Array<{ name: string }> })?.people?.[0]?.name ?? null,
    currency:       ((p["Currency"] as { select?: { name: string } })?.select?.name) ?? "EUR",
    shareUrl:       (p["Share URL"] as { url?: string })?.url ?? null,
    sentAt:         dateStr(p["Sent At"] as never),
    viewedAt:       dateStr(p["Viewed At"] as never),
    acceptedAt:     dateStr(p["Accepted At"] as never),
    signedAt:       dateStr(p["Signed At"] as never),
  };
}

function pageToBlock(page: Record<string, unknown>): ProposalBlock {
  const p = page.properties as Record<string, unknown>;
  const itemsRaw = plainText(p["Items"] as never);
  const blockType = ((p["Block Type"] as { select?: { name: string } })?.select?.name ?? "description") as BlockType;
  const stagesJson = plainText(p["Stages JSON"] as never);

  let services: ProposalService[] = [];
  if (blockType === "pricing" && stagesJson) {
    try {
      const parsed = JSON.parse(stagesJson);
      if (Array.isArray(parsed)) {
        services = parsed
          .filter((s) => s && typeof s === "object")
          .map((s, i) => ({
            notionPageId: String(s.notionPageId ?? ""),
            title: String(s.title ?? ""),
            desc: String(s.desc ?? ""),
            price: String(s.price ?? ""),
            duration: String(s.duration ?? ""),
            allocation: String(s.allocation ?? ""),
            sortOrder: i,
          }));
      }
    } catch { /* invalid JSON */ }
  }

  return {
    notionPageId: page.id as string,
    blockType,
    locked:       (p["Locked"] as { checkbox?: boolean })?.checkbox ?? false,
    sortOrder:    (p["Sort Order"] as { number?: number })?.number ?? 0,
    heading:      plainText(p["Heading"] as never),
    body:         plainText(p["Body"] as never),
    clientName:   plainText(p["Client Name"] as never),
    subtitle:     plainText(p["Subtitle"] as never),
    items:        itemsRaw ? itemsRaw.split("\n").filter(Boolean) : [],
    stagesJson,
    services,
  };
}

function pageToService(page: Record<string, unknown>): ProposalService {
  const p = page.properties as Record<string, unknown>;
  return {
    notionPageId: page.id as string,
    title:        titleText(p["Name"] as never),
    desc:         plainText(p["Desc"] as never),
    price:        plainText(p["Price"] as never),
    duration:     plainText(p["Duration"] as never),
    allocation:   "",
    sortOrder:    (p["Sort Order"] as { number?: number })?.number ?? 0,
  };
}

// ─── Inline Blocks DB creation ────────────────────────────────────────────────

async function createInlineBlocksDb(proposalPageId: string): Promise<string> {
  const db = await notionFetch("/databases", {
    method: "POST",
    body: JSON.stringify({
      parent: { type: "page_id", page_id: proposalPageId },
      is_inline: true,
      title: richText("Blocks"),
      properties: {
        "Name":        { title: {} },
        "Block Type":  { select: { options: [
          { name: "header",      color: "blue"   },
          { name: "intro",       color: "purple" },
          { name: "pricing",     color: "green"  },
          { name: "description", color: "gray"   },
          { name: "benefits",    color: "orange" },
          { name: "scope",       color: "yellow" },
          { name: "process",     color: "pink"   },
          { name: "approach",    color: "brown"  },
          { name: "impact",      color: "red"    },
          { name: "cta",         color: "blue"   },
          { name: "partnership", color: "gray"   },
          { name: "about",       color: "green"  },
          { name: "footer",      color: "default"},
        ]}},
        "Locked":      { checkbox: {} },
        "Sort Order":  { number: {} },
        "Heading":     { rich_text: {} },
        "Body":        { rich_text: {} },
        "Client Name": { rich_text: {} },
        "Subtitle":    { rich_text: {} },
        "Items":       { rich_text: {} },
        "Stages JSON": { rich_text: {} },
      },
    }),
  });
  return db.id as string;
}

// ─── Proposals ────────────────────────────────────────────────────────────────

/** How many proposals are already linked to a client (drives the default name's number). */
export async function countClientProposals(clientPageId: string): Promise<number> {
  const data = await notionFetch(
    `/databases/${process.env.NOTION_PROPOSALS_DB_ID}/query`,
    {
      method: "POST",
      body: JSON.stringify({
        filter: { property: "Client", relation: { contains: clientPageId } },
        page_size: 100,
      }),
    }
  );
  return ((data.results as Array<unknown>) ?? []).length;
}

/** Fetch a single proposal by its Notion page ID. */
export async function getProposal(pageId: string): Promise<Proposal | null> {
  try {
    const page = await notionFetch(`/pages/${pageId}`);
    return pageToProposal(page);
  } catch {
    return null;
  }
}

export async function getProposalBySlug(slug: string): Promise<Proposal | null> {
  const data = await notionFetch(
    `/databases/${process.env.NOTION_PROPOSALS_DB_ID}/query`,
    {
      method: "POST",
      body: JSON.stringify({
        filter: { property: "Slug", rich_text: { equals: slug } },
        page_size: 1,
      }),
    }
  );
  const results = data.results as Array<Record<string, unknown>>;
  return results.length > 0 ? pageToProposal(results[0]) : null;
}

export async function listProposals(createdBy?: string): Promise<Proposal[]> {
  const filter = createdBy
    ? { property: "Created By", people: { contains: createdBy } }
    : undefined;
  const data = await notionFetch(
    `/databases/${process.env.NOTION_PROPOSALS_DB_ID}/query`,
    {
      method: "POST",
      body: JSON.stringify({
        ...(filter ? { filter } : {}),
        sorts: [{ timestamp: "created_time", direction: "descending" }],
        page_size: 50,
      }),
    }
  );
  return ((data.results as Array<Record<string, unknown>>) ?? []).map(pageToProposal);
}

/**
 * Create a new draft proposal.
 * Automatically creates an inline Blocks DB inside the proposal page
 * and stores its ID in the `Blocks DB ID` property.
 */
export async function createProposal(fields: {
  title: string;
  slug: string;
  accessToken: string;
  dealPageId?: string;
  currency?: string;
  createdByNotionUserId?: string;
}): Promise<Proposal> {
  // 1. Create the Proposal page
  const page = await notionFetch("/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_PROPOSALS_DB_ID },
      properties: {
        "Name":         { title: richText(fields.title) },
        "Status":       { select: { name: "draft" } },
        "Slug":         { rich_text: richText(fields.slug) },
        "Access Token": { rich_text: richText(fields.accessToken) },
        "Currency":     { select: { name: fields.currency ?? "EUR" } },
        ...(fields.dealPageId ? { "Deal": { relation: [{ id: fields.dealPageId }] } } : {}),
        // Only set Created By when we have a real Notion UUID (not the dev-bypass placeholder).
        ...(fields.createdByNotionUserId && fields.createdByNotionUserId !== "dev-user"
          ? { "Created By": { people: [{ id: fields.createdByNotionUserId }] } }
          : {}),
      },
    }),
  });
  const proposalPageId = page.id as string;

  // 2. Create inline Blocks DB inside the proposal page
  const blocksDatabaseId = await createInlineBlocksDb(proposalPageId);

  // 3. Write Blocks DB ID back onto the Proposal page
  await notionFetch(`/pages/${proposalPageId}`, {
    method: "PATCH",
    body: JSON.stringify({
      properties: {
        "Blocks DB ID": { rich_text: richText(blocksDatabaseId) },
      },
    }),
  });

  return { ...pageToProposal(page), blocksDatabaseId };
}

export async function updateProposal(
  pageId: string,
  fields: Partial<Pick<Proposal, "title" | "status" | "shareUrl" | "clientPageId" | "dealPageId" | "sentAt" | "viewedAt" | "acceptedAt" | "signedAt">>
): Promise<Proposal> {
  const props: Record<string, unknown> = {};
  if (fields.title !== undefined) props["Name"] = { title: richText(fields.title) };
  if (fields.status)       props["Status"]       = { select: { name: fields.status } };
  if (fields.shareUrl)     props["Share URL"]     = { url: fields.shareUrl };
  if (fields.clientPageId) props["Client"]        = { relation: [{ id: fields.clientPageId }] };
  if (fields.dealPageId)   props["Deal"]          = { relation: [{ id: fields.dealPageId }] };
  if (fields.sentAt)       props["Sent At"]       = { date: { start: fields.sentAt } };
  if (fields.viewedAt)     props["Viewed At"]     = { date: { start: fields.viewedAt } };
  if (fields.acceptedAt)   props["Accepted At"]   = { date: { start: fields.acceptedAt } };
  if (fields.signedAt)     props["Signed At"]     = { date: { start: fields.signedAt } };

  const page = await notionFetch(`/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties: props }),
  });
  return pageToProposal(page);
}

// ─── Blocks ───────────────────────────────────────────────────────────────────

/**
 * Fetch all blocks from a proposal's inline Blocks DB,
 * with services attached to the pricing block.
 */
export async function getProposalBlocks(
  blocksDatabaseId: string,
  _proposalPageId: string
): Promise<ProposalBlock[]> {
  if (!blocksDatabaseId) return [];

  const blocksData = await notionFetch(`/databases/${blocksDatabaseId}/query`, {
    method: "POST",
    body: JSON.stringify({
      sorts: [{ property: "Sort Order", direction: "ascending" }],
      page_size: 50,
    }),
  });

  // Services are stored as JSON inside the pricing block's "Stages JSON" field
  // and parsed directly in pageToBlock — no separate DB query needed.
  return ((blocksData.results as Array<Record<string, unknown>>) ?? []).map(pageToBlock);
}

/** Persisted id mapping returned by saveBlocks, in input order. */
export type SavedBlockRef = { notionPageId: string; serviceIds: string[] };

/**
 * Upsert/delete blocks to match the desired state.
 * Returns the persisted Notion page id of each block (in input order) plus the
 * ids of its services, so the caller can reconcile temp ids → real ids and keep
 * subsequent saves stable (no churn / no duplicates).
 */
export async function saveBlocks(
  blocksDatabaseId: string,
  _proposalPageId: string,
  blocks: Array<Omit<ProposalBlock, "services"> & { services?: ProposalService[] }>,
  deletedNotionPageIds: string[] = []
): Promise<SavedBlockRef[]> {
  // Archive explicitly deleted blocks first (sent by the editor when a block is removed).
  // This avoids the need to re-fetch all blocks on every save just to detect deletions.
  if (deletedNotionPageIds.length > 0) {
    await Promise.all(
      // Deduplicate in case the same id was queued twice (e.g. retry after failed save).
      [...new Set(deletedNotionPageIds)].map((id) =>
        withRetry(() =>
          notionFetch(`/pages/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ archived: true }),
          })
        ).catch(() => {
          // Ignore errors (404 = already archived, which is the desired state).
        })
      )
    );
  }

  // Upsert all current blocks. A block with a notionPageId already exists → PATCH.
  // A block without one is new → POST.
  const refs = await Promise.all(
    blocks.map(async (b, i) => {
      const props: Record<string, unknown> = {
        "Name":        { title: richText(b.blockType) },
        "Block Type":  { select: { name: b.blockType } },
        "Locked":      { checkbox: b.locked },
        "Sort Order":  { number: i },
        "Heading":     { rich_text: richText(b.heading ?? "") },
        "Body":        { rich_text: richText(b.body ?? "") },
        "Client Name": { rich_text: richText(b.clientName ?? "") },
        "Subtitle":    { rich_text: richText(b.subtitle ?? "") },
        "Items":       { rich_text: richText((b.items ?? []).join("\n")) },
        "Stages JSON": { rich_text: richText(
          b.blockType === "pricing"
            ? JSON.stringify(b.services ?? [])
            : (b.stagesJson ?? "")
        ) },
      };

      if (b.notionPageId) {
        await withRetry(() =>
          notionFetch(`/pages/${b.notionPageId}`, {
            method: "PATCH",
            body: JSON.stringify({ properties: props }),
          })
        );
        return { notionPageId: b.notionPageId, serviceIds: [] } satisfies SavedBlockRef;
      }

      const created = await withRetry(() =>
        notionFetch("/pages", {
          method: "POST",
          body: JSON.stringify({
            parent: { database_id: blocksDatabaseId },
            properties: props,
          }),
        })
      );
      return { notionPageId: created.id as string, serviceIds: [] } satisfies SavedBlockRef;
    })
  );

  return refs;
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Archive (trash) a proposal page. Notion archives are recoverable from Notion's
 * trash. The inline Blocks DB lives inside the page and becomes inaccessible too.
 */
export async function deleteProposal(pageId: string): Promise<void> {
  await notionFetch(`/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({ archived: true }),
  });
}

// ─── Deals ────────────────────────────────────────────────────────────────────

export type Deal = { notionPageId: string; title: string };

/** Search Notion pages/DB-entries that match query — used to pick a deal. */
export async function searchDeals(query: string): Promise<Deal[]> {
  // If a dedicated deals DB is configured, query it directly (faster, more precise).
  if (process.env.NOTION_DEALS_DB_ID) {
    const data = await notionFetch(
      `/databases/${process.env.NOTION_DEALS_DB_ID}/query`,
      {
        method: "POST",
        body: JSON.stringify({
          filter: query.trim()
            ? { property: "Name", title: { contains: query.trim() } }
            : undefined,
          sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
          page_size: 10,
        }),
      }
    );
    return ((data.results as Array<Record<string, unknown>>) ?? []).map((p) => ({
      notionPageId: p.id as string,
      title: titleText((p.properties as Record<string, unknown>)["Name"] as never) || "Untitled",
    }));
  }

  // Fallback: Notion search API (searches across all accessible pages).
  const data = await notionFetch("/search", {
    method: "POST",
    body: JSON.stringify({
      query: query.trim(),
      filter: { value: "page", property: "object" },
      sort: { direction: "descending", timestamp: "last_edited_time" },
      page_size: 10,
    }),
  });
  return ((data.results as Array<Record<string, unknown>>) ?? []).map((p) => {
    const props = p.properties as Record<string, unknown> | undefined;
    const titleProp = props
      ? (props["Name"] ?? props["Title"] ?? Object.values(props).find((v) => (v as Record<string, unknown>).type === "title"))
      : undefined;
    const name = titleProp
      ? titleText(titleProp as never) || "Untitled"
      : "Untitled";
    return { notionPageId: p.id as string, title: name };
  });
}

/** Fetch title of a single Notion page by ID (for displaying the linked deal name). */
export async function getDealTitle(pageId: string): Promise<string> {
  try {
    const page = await notionFetch(`/pages/${pageId}`);
    const props = page.properties as Record<string, unknown> | undefined;
    const titleProp = props
      ? (props["Name"] ?? props["Title"] ?? Object.values(props).find((v) => (v as Record<string, unknown>)?.type === "title"))
      : undefined;
    return titleProp ? titleText(titleProp as never) || "Deal" : "Deal";
  } catch {
    return "Deal";
  }
}

// ─── Services ─────────────────────────────────────────────────────────────────

/** Returns the persisted service ids in input order. */
async function saveServices(
  proposalPageId: string,
  services: Array<Partial<ProposalService>>
): Promise<string[]> {
  if (!process.env.NOTION_SERVICES_DB_ID) return services.map(() => "");
  let data: Record<string, unknown>;
  try {
    data = await notionFetch(`/databases/${process.env.NOTION_SERVICES_DB_ID}/query`, {
      method: "POST",
      body: JSON.stringify({
        filter: { property: "Proposal", relation: { contains: proposalPageId } },
        page_size: 50,
      }),
    });
  } catch {
    return services.map(() => "");
  }
  const existing = ((data.results as Array<Record<string, unknown>>) ?? []).map(pageToService);
  const existingIds = new Set(existing.map((s) => s.notionPageId));
  const incomingIds = new Set(services.filter((s) => s.notionPageId).map((s) => s.notionPageId));

  for (const old of existing) {
    if (!incomingIds.has(old.notionPageId)) {
      await withRetry(() =>
        notionFetch(`/pages/${old.notionPageId}`, {
          method: "PATCH",
          body: JSON.stringify({ archived: true }),
        })
      );
    }
  }

  const ids: string[] = [];
  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    const props: Record<string, unknown> = {
      "Name":       { title: richText(s.title ?? "") },
      "Proposal":   { relation: [{ id: proposalPageId }] },
      "Desc":       { rich_text: richText(s.desc ?? "") },
      "Price":      { rich_text: richText(s.price ?? "") },
      "Duration":   { rich_text: richText(s.duration ?? "") },
      "Sort Order": { number: i },
    };

    if (s.notionPageId && existingIds.has(s.notionPageId)) {
      await withRetry(() =>
        notionFetch(`/pages/${s.notionPageId}`, {
          method: "PATCH",
          body: JSON.stringify({ properties: props }),
        })
      );
      ids.push(s.notionPageId);
    } else {
      const created = await withRetry(() =>
        notionFetch("/pages", {
          method: "POST",
          body: JSON.stringify({
            parent: { database_id: process.env.NOTION_SERVICES_DB_ID },
            properties: props,
          }),
        })
      );
      ids.push(created.id as string);
    }
  }
  return ids;
}
