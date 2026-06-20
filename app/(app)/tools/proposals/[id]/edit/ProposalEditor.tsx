"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/app/components/atoms";
import { StatusBadge } from "../../../../components/StatusBadge";
import { BlockView } from "../../../blocks/registry";
import {
  makeBlock,
  toSaveInput,
  PINNED_BLOCK_TYPES,
  type BlockType,
  type EditorBlock,
} from "../../../blocks/types";
import type { ProposalStatus } from "@/lib/notion-proposals";
import { saveProposalAction } from "../../actions";
import { BlockFrame } from "./BlockFrame";
import { InsertPoint } from "./InsertPoint";
import { ShareButton } from "./ShareButton";
import { DeleteButton } from "./DeleteButton";
import { DealPicker } from "./DealPicker";
import { ProposalApproachEdit } from "./ProposalApproachEdit";

type SaveState = "idle" | "pending" | "saving" | "saved" | "error";

type Props = {
  proposalPageId: string;
  blocksDatabaseId: string;
  title: string;
  slug: string;
  status: ProposalStatus;
  initialBlocks: EditorBlock[];
  dealPageId?: string | null;
  dealTitle?: string | null;
};

const AUTOSAVE_MS = 1500;

function reorderForDisplay(arr: EditorBlock[]): EditorBlock[] {
  // pricing immediately follows approach (mirrors public page.tsx reordering)
  const approachIdx = arr.findIndex((b) => b.blockType === "approach");
  const pricingIdx = arr.findIndex((b) => b.blockType === "pricing");
  if (approachIdx !== -1 && pricingIdx !== -1 && pricingIdx !== approachIdx + 1) {
    const pricing = arr[pricingIdx];
    const without = arr.filter((_, i) => i !== pricingIdx);
    const insertAt = without.findIndex((b) => b.blockType === "approach") + 1;
    arr = [...without.slice(0, insertAt), pricing, ...without.slice(insertAt)];
  }
  // partnership immediately before process
  const partnershipIdx = arr.findIndex((b) => b.blockType === "partnership");
  const processIdx = arr.findIndex((b) => b.blockType === "process");
  if (partnershipIdx !== -1 && processIdx !== -1 && partnershipIdx !== processIdx - 1) {
    const partnership = arr[partnershipIdx];
    const without = arr.filter((_, i) => i !== partnershipIdx);
    const insertAt = without.findIndex((b) => b.blockType === "process");
    arr = [...without.slice(0, insertAt), partnership, ...without.slice(insertAt)];
  }
  return arr;
}

export function ProposalEditor({
  proposalPageId,
  blocksDatabaseId,
  title,
  slug,
  status,
  initialBlocks,
  dealPageId = null,
  dealTitle = null,
}: Props) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(() => reorderForDisplay(initialBlocks));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  // Notion page IDs of blocks removed since last save — sent to the server so they get archived.
  const deletedIdsRef = useRef<string[]>([]);

  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;

  // rev only bumps on *user* edits, so adopting persisted ids never re-triggers save.
  const revRef = useRef(0);
  const savedRevRef = useRef(0);
  const [rev, setRev] = useState(0);
  const bump = useCallback(() => {
    revRef.current += 1;
    setRev(revRef.current);
  }, []);

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const patchBlock = useCallback((id: string, patch: Partial<EditorBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    bump();
  }, [bump]);

  const moveBlock = useCallback((id: string, dir: -1 | 1) => {
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      // Never swap with a pinned block
      if (PINNED_BLOCK_TYPES.includes(prev[j].blockType)) return prev;
      const next = prev.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    bump();
  }, [bump]);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const block = prev.find((b) => b.id === id);
      if (block?.notionPageId) deletedIdsRef.current.push(block.notionPageId);
      return prev.filter((b) => b.id !== id);
    });
    bump();
  }, [bump]);

  const insertAfter = useCallback((index: number, type: BlockType) => {
    setBlocks((prev) => {
      const next = prev.slice();
      next.splice(index + 1, 0, makeBlock(type));
      return next;
    });
    bump();
  }, [bump]);

  // ─── Save ─────────────────────────────────────────────────────────────────────

  // Serialize saves: never run two saveProposalActions at once (overlapping
  // full-document writes contend on Notion's rate limit → 20s+ saves). If edits
  // land mid-save, coalesce them into one follow-up save when the current ends.
  const inFlightRef = useRef(false);
  const pendingRef = useRef(false);

  const adoptIds = useCallback((res: Awaited<ReturnType<typeof saveProposalAction>>) => {
    if (!res.ok) return;
    // Adopt persisted ids by stable clientId — without touching text or React keys.
    setBlocks((prev) =>
      prev.map((b) => {
        const m = res.blocks.find((x) => x.clientId === b.id);
        if (!m) return b;
        const services = b.services.map((s) => {
          if (s.notionPageId) return s;
          const ms = m.services.find((y) => y.clientId === s.id);
          return ms?.notionPageId ? { ...s, notionPageId: ms.notionPageId } : s;
        });
        const needId = !b.notionPageId && m.notionPageId;
        if (!needId && services === b.services) return b;
        return { ...b, notionPageId: needId ? m.notionPageId : b.notionPageId, services };
      })
    );
  }, []);

  const doSave = useCallback(async () => {
    if (inFlightRef.current) {
      pendingRef.current = true; // coalesce — save again once the current one ends
      return;
    }
    inFlightRef.current = true;
    setSaveState("saving");
    try {
      do {
        pendingRef.current = false;
        const revAtSave = revRef.current;
        const toDelete = deletedIdsRef.current.splice(0);
        const res = await saveProposalAction(
          proposalPageId,
          blocksDatabaseId,
          toSaveInput(blocksRef.current),
          toDelete
        );
        if (!res.ok) {
          // Put the IDs back so the next save retries the deletion.
          deletedIdsRef.current.unshift(...toDelete);
          setSaveState("error");
          return;
        }
        adoptIds(res);
        savedRevRef.current = revAtSave;
      } while (pendingRef.current);
      setSaveState(revRef.current === savedRevRef.current ? "saved" : "pending");
    } finally {
      inFlightRef.current = false;
    }
  }, [proposalPageId, blocksDatabaseId, adoptIds]);

  // Debounced autosave on user edits.
  useEffect(() => {
    if (rev === 0) return; // no edits yet
    setSaveState("pending");
    const t = setTimeout(doSave, AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [rev, doSave]);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (revRef.current !== savedRevRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col">
      <EditorToolbar
        title={(() => {
          const h = blocks.find((b) => b.blockType === "header");
          if (!h) return title;
          const parts = [`#${h.subtitle || "0001"}`];
          if (h.clientName) parts.push(h.clientName, "—");
          if (h.heading) parts.push(h.heading);
          return parts.join(" ");
        })()}
        slug={slug}
        status={status}
        saveState={saveState}
        onSave={doSave}
        proposalPageId={proposalPageId}
      />

      {(() => {
        const beforeCta: React.ReactNode[] = [];
        const afterCta: React.ReactNode[] = [];
        let pastCta = false;
        let i = 0;

        while (i < blocks.length) {
          const block = blocks[i];
          const next = blocks[i + 1];
          const target = pastCta ? afterCta : beforeCta;

          if (block.blockType === "approach" && next?.blockType === "pricing") {
            const approachIdx = i;
            target.push(
              <div key={block.id}>
                <BlockFrame
                  locked={true}
                  canMove={false}
                  isFirst={i === 0}
                  isLast={i + 1 === blocks.length - 1}
                  onMoveUp={() => {}}
                  onMoveDown={() => {}}
                  onDelete={() => {}}
                >
                  <ProposalApproachEdit
                    approachBlock={block}
                    pricingBlock={next}
                    onChangeApproach={(patch) => patchBlock(block.id, patch)}
                    onChangePricing={(patch) => patchBlock(next.id, patch)}
                  />
                </BlockFrame>
                <InsertPoint onInsert={(type) => insertAfter(approachIdx + 1, type)} />
              </div>
            );
            i += 2;
            continue;
          }

          if (block.blockType === "cta") {
            pastCta = true;
          }

          const blockIdx = i;
          target.push(
            <div key={block.id}>
              <BlockFrame
                locked={block.locked}
                canMove={!PINNED_BLOCK_TYPES.includes(block.blockType)}
                isFirst={i === 0}
                isLast={i === blocks.length - 1}
                onMoveUp={() => moveBlock(block.id, -1)}
                onMoveDown={() => moveBlock(block.id, 1)}
                onDelete={() => removeBlock(block.id)}
              >
                <BlockView
                  block={block}
                  mode="edit"
                  proposalPageId={proposalPageId}
                  onChange={(patch) => patchBlock(block.id, patch)}
                />
                {block.blockType === "header" && (
                  <DealPicker
                    proposalPageId={proposalPageId}
                    initialDealPageId={dealPageId}
                    initialDealTitle={dealTitle}
                  />
                )}
              </BlockFrame>
              {block.blockType !== "footer" && <InsertPoint onInsert={(type) => insertAfter(blockIdx, type)} />}
            </div>
          );
          if (block.blockType === "partnership" && pastCta) {
            target.push(
              <img
                key={`${block.id}-team`}
                src="/images/teamImageNarrow.png"
                alt="Native Works team"
                className="w-full rounded-xl object-cover max-h-[320px] mt-s2 mb-s6"
              />
            );
          }
          i++;
        }

        return (
          <>
            <div className="mx-auto w-full max-w-editor px-s5 py-s12 flex flex-col gap-s4">
              {beforeCta}
            </div>
            {afterCta.length > 0 && (
              <div className="w-full bg-prim/[0.025] pt-s12 pb-s4">
                <div className="mx-auto w-full max-w-editor px-s5 flex flex-col gap-s4">
                  {afterCta}
                </div>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}

// ─── Toolbar ───────────────────────────────────────────────────────────────────

const SAVE_LABEL: Record<SaveState, string> = {
  idle: "All changes saved",
  pending: "Editing…",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed — retry",
};

function EditorToolbar({
  title,
  slug,
  status,
  saveState,
  onSave,
  proposalPageId,
}: {
  title: string;
  slug: string;
  status: ProposalStatus;
  saveState: SaveState;
  onSave: () => void;
  proposalPageId: string;
}) {
  return (
    <div className="sticky top-s9 z-20 flex flex-col bg-white/85 backdrop-blur border-b border-prim/8">
      <div className="flex items-center justify-between gap-s4 h-s8 px-s4">
        <div className="flex items-center gap-s2 min-w-0">
          <a href="/tools" className="grid place-items-center size-s5 rounded-pill text-prim/50 hover:bg-prim/8 hover:text-prim transition-colors">
            <Icon name="chevron-left" size="md" />
          </a>
          <span className="font-body font-medium text-l1 text-prim truncate">{title}</span>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-s1">
          <button
            type="button"
            onClick={onSave}
            className={`inline-flex items-center h-s5 px-s2 font-body text-l1 transition-colors ${
              saveState === "error"
                ? "text-error hover:opacity-80 cursor-pointer"
                : "text-prim/45"
            }`}
          >
            {SAVE_LABEL[saveState]}
          </button>
          <ShareButton proposalPageId={proposalPageId} />
          <a
            href={`/p/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center pb-px h-s5 px-s3 rounded-pill bg-prim text-white font-body font-medium text-l1 hover:opacity-85 transition-opacity"
          >
            Preview
          </a>
          <DeleteButton proposalPageId={proposalPageId} title={title} />
        </div>
      </div>
    </div>
  );
}
