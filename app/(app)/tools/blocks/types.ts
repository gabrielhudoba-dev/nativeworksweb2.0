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
  title: string;
  desc: string;
  price: string;
  duration: string;
};

export type EditorStage = {
  title: string;
  desc: string;
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
  intro:       "Intro",
  pricing:     "Pricing",
  description: "Description",
  benefits:    "Benefits",
  scope:       "Scope",
  process:     "Process",
};

/** Which optional blocks the picker offers (locked ones are seeded, not inserted). */
export const OPTIONAL_BLOCK_TYPES: BlockType[] = [
  "description",
  "benefits",
  "scope",
  "process",
];

export const LOCKED_BLOCK_TYPES: BlockType[] = ["header", "intro", "pricing"];

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
      return { ...b, clientName: "Client name", heading: "Project title", subtitle: "A short subtitle" };
    case "intro":
      return { ...b, heading: "Introduction", body: "Set the scene for this proposal." };
    case "pricing":
      return {
        ...b,
        heading: "Investment",
        services: [
          { id: uid(), notionPageId: "", title: "Service", desc: "What's included", price: "€5K", duration: "2 weeks" },
        ],
      };
    case "description":
      return { ...b, heading: "Overview", body: "Describe the work in detail." };
    case "benefits":
      return { ...b, heading: "Benefits", items: ["First benefit", "Second benefit"] };
    case "scope":
      return { ...b, heading: "Scope of work", items: ["First deliverable", "Second deliverable"] };
    case "process":
      return {
        ...b,
        heading: "Process",
        stages: [
          { title: "Discovery", desc: "We learn your goals." },
          { title: "Delivery", desc: "We build and ship." },
        ],
      };
  }
}

/** The default starting document for a new proposal: the three locked blocks. */
export function defaultDocument(): EditorBlock[] {
  return [makeBlock("header"), makeBlock("intro"), makeBlock("pricing")];
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
          .map((s) => ({ title: String(s.title ?? ""), desc: String(s.desc ?? "") }));
      }
    } catch {
      stages = [];
    }
  }
  return {
    id: b.notionPageId,
    notionPageId: b.notionPageId,
    blockType: b.blockType,
    locked: b.locked,
    heading: b.heading,
    body: b.body,
    clientName: b.clientName,
    subtitle: b.subtitle,
    items: b.items,
    stages,
    services: b.services.map((s) => ({
      id: s.notionPageId,
      notionPageId: s.notionPageId,
      title: s.title,
      desc: s.desc,
      price: s.price,
      duration: s.duration,
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
    stagesJson: b.blockType === "process" ? JSON.stringify(b.stages) : "",
    services: b.services.map((s) => ({
      clientId: s.id,
      notionPageId: s.notionPageId,
      title: s.title,
      desc: s.desc,
      price: s.price,
      duration: s.duration,
    })),
  }));
}
