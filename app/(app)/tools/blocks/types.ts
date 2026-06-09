/**
 * Editor-side block model. The canonical store is Notion (ProposalBlock),
 * but the editor works with a richer in-memory shape: `stages` parsed from JSON,
 * a stable client `id`, and a uniform field set so the registry renderers can be
 * pure functions of `block`.
 */

import type { BlockType, ProposalBlock, ProposalService } from "@/lib/notion-proposals";

export type { BlockType };

export type EditorService = {
  id: string;            // stable React key — never changes (tmp- for new, real for loaded)
  notionPageId: string;  // "" until first save, then the real Notion id
  isRetainer: boolean;   // monthly retainer — price is per-month, multiplied by months in subtotal
  title: string;
  desc: string;
  price: string;
  duration: string;      // time period ("2 weeks", "3 months") — retainer uses this for price calc
  allocation: string;    // FTE allocation ("0.5 FTE", "1 FTE") — display only
};

export type EditorStage = {
  title: string;
  desc: string;
  duration?: string;
};

export type EditorBlock = {
  id: string;            // notionPageId for persisted blocks, temp uuid for new ones
  notionPageId: string;  // "" until first save
  blockType: BlockType;
  locked: boolean;
  heading: string;
  body: string;
  clientName: string;    // header only
  subtitle: string;      // header only
  items: string[];       // benefits / scope
  stages: EditorStage[]; // process
  services: EditorService[]; // pricing
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const BLOCK_LABELS: Record<BlockType, string> = {
  header:      "Header",
  intro:       "Executive Summary",
  pricing:     "Pricing",
  description: "Description",
  benefits:    "Benefits",
  scope:       "Scope",
  process:     "Process",
  approach:    "Approach",
  impact:      "Impact",
  cta:         "CTA",
  partnership: "Partnership & Governance",
  about:       "About",
  footer:      "Footer",
};

/** Which optional blocks the picker offers (locked ones are seeded, not inserted). */
export const OPTIONAL_BLOCK_TYPES: BlockType[] = [
  "description",
  "scope",
  "process",
];

/** Blocks that cannot be deleted (shown as "Locked" in the editor). */
export const LOCKED_BLOCK_TYPES: BlockType[] = ["header", "intro", "approach", "pricing", "cta", "partnership", "footer"];

/** Blocks that are fixed in position and cannot be moved (header always first, footer always last). */
export const PINNED_BLOCK_TYPES: BlockType[] = ["header", "cta", "partnership", "footer"];

/** Temp id for not-yet-persisted blocks/services. Always "tmp-" prefixed so it's
 *  distinguishable from a real 36-char Notion page id at save time. */
function uid(): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
  return `tmp-${rand}`;
}

function emptyBlock(blockType: BlockType, locked: boolean): EditorBlock {
  return {
    id: uid(),
    notionPageId: "",
    blockType,
    locked,
    heading: "",
    body: "",
    clientName: "",
    subtitle: "",
    items: [],
    stages: [],
    services: [],
  };
}

/** A fresh block of a given type with sensible placeholder content. */
export function makeBlock(blockType: BlockType): EditorBlock {
  const locked = LOCKED_BLOCK_TYPES.includes(blockType);
  const b = emptyBlock(blockType, locked);
  switch (blockType) {
    case "header":
      return { ...b, clientName: "Client Name", heading: "Project Title", subtitle: "0001" };
    case "intro":
      return { ...b, heading: "Executive Summary", body: "Write a concise summary of this engagement — the problem, the proposed solution, and the expected outcome." };
    case "approach":
      return {
        ...b,
        heading: "Approach",
        stages: [
          { title: "Discovery & Strategy", duration: "2 weeks", desc: "We begin with a deep-dive into your goals, technical constraints, and user needs. This phase produces a clear scope, success criteria, and delivery roadmap." },
        ],
      };
    case "impact":
      return { ...b, heading: "Impact", body: "Describe the measurable outcomes and business value this engagement will deliver." };
    case "pricing":
      return { ...b, heading: "Services", body: "19", services: [] };
    case "cta":
      return { ...b, heading: "Ready to move forward?" };
    case "process":
      return {
        ...b,
        heading: "How we work",
        stages: [
          { title: "Discover", desc: "We learn your goals, constraints, and audience before writing a single line of code or pixel." },
          { title: "Design", desc: "Prototypes and user flows are validated early so we build the right thing, fast." },
          { title: "Deliver", desc: "Iterative delivery in short cycles keeps scope tight and quality high throughout." },
          { title: "Support", desc: "After launch we monitor, measure, and iterate to maximise the value of your investment." },
        ],
      };
    case "partnership":
      return {
        ...b,
        heading: "Partnership & Governance Structure",
        body: "You'll have a dedicated point of contact, weekly status updates, and clear escalation paths. All work is tracked in shared tooling and reviewed at each milestone.",
      };
    case "about":
      return {
        ...b,
        heading: "About Native Works",
        body: "Native Works is a strategic design and product studio. We help ambitious companies design, build, and scale digital products — from early concept through to production. Our team combines senior product design, engineering, and strategy expertise to deliver work that is both beautiful and measurable.",
      };
    case "footer":
      return {
        ...b,
        heading: "Native Works",
        body: "hello@nativeworks.com · nativeworks.com",
      };
    case "description":
      return { ...b, heading: "Overview", body: "Describe the work in detail." };
    case "benefits":
      return { ...b, heading: "Benefits", items: ["First benefit", "Second benefit"] };
    case "scope":
      return { ...b, heading: "Scope of work", items: ["First deliverable", "Second deliverable"] };
  }
}

/** The default starting document for a new proposal. */
export function defaultDocument(): EditorBlock[] {
  return [
    makeBlock("header"),
    makeBlock("intro"),
    makeBlock("approach"),
    makeBlock("impact"),
    makeBlock("pricing"),
    makeBlock("cta"),
    makeBlock("process"),
    makeBlock("partnership"),
    makeBlock("footer"),
  ];
}

// ─── Notion ⇄ Editor conversion ───────────────────────────────────────────────

export function fromNotionBlock(b: ProposalBlock): EditorBlock {
  let stages: EditorStage[] = [];
  if (b.stagesJson) {
    try {
      const parsed = JSON.parse(b.stagesJson);
      if (Array.isArray(parsed)) {
        stages = parsed
          .filter((s) => s && typeof s === "object")
          .map((s) => ({ title: String(s.title ?? ""), desc: String(s.desc ?? ""), ...(s.duration != null ? { duration: String(s.duration) } : {}) }));
      }
    } catch {
      stages = [];
    }
  }

  // Migrate header heading from old full-composed format "#0001 Client — Project" → "Project"
  let heading = b.heading;
  if (b.blockType === "header" && heading.startsWith("#")) {
    const sep = heading.indexOf(" — ");
    heading = sep !== -1 ? heading.slice(sep + 3) : heading.replace(/^#\S+\s+/, "");
  }

  return {
    id: b.notionPageId,
    notionPageId: b.notionPageId,
    blockType: b.blockType,
    locked: LOCKED_BLOCK_TYPES.includes(b.blockType),
    heading,
    body: b.body,
    clientName: b.clientName,
    subtitle: b.subtitle,
    items: b.items,
    stages,
    services: b.services.map((s, i) => ({
      id: s.notionPageId || `json-${i}`,
      notionPageId: s.notionPageId,
      isRetainer: s.desc === "__retainer__",
      title: s.title,
      desc: s.desc === "__retainer__" ? "" : s.desc,
      price: s.price,
      duration: s.duration,
      allocation: (s as unknown as { allocation?: string }).allocation ?? "",
    })),
  };
}

/** Shape the editor sends to the save action (plain, serializable).
 *  `clientId` is the editor's stable id, echoed back so temp→real id reconciliation
 *  survives reordering and concurrent edits. */
export type SaveBlockInput = {
  clientId: string;
  notionPageId: string;
  blockType: BlockType;
  locked: boolean;
  heading: string;
  body: string;
  clientName: string;
  subtitle: string;
  items: string[];
  stagesJson: string;
  services: Array<{
    clientId: string;
    notionPageId: string;
    title: string;
    desc: string;
    price: string;
    duration: string;
    allocation: string;
  }>;
};

export function toSaveInput(blocks: EditorBlock[]): SaveBlockInput[] {
  return blocks.map((b) => ({
    clientId: b.id,
    notionPageId: b.notionPageId,
    blockType: b.blockType,
    locked: b.locked,
    heading: b.heading,
    body: b.body,
    clientName: b.clientName,
    subtitle: b.subtitle,
    items: b.items,
    stagesJson: (b.blockType === "process" || b.blockType === "approach") ? JSON.stringify(b.stages) : "",
    services: b.services.map((s) => ({
      clientId: s.id,
      notionPageId: s.notionPageId,
      title: s.title,
      desc: s.isRetainer ? "__retainer__" : (s.desc || ""),
      price: s.price,
      duration: s.duration,
      allocation: s.allocation || "",
    })),
  }));
}
