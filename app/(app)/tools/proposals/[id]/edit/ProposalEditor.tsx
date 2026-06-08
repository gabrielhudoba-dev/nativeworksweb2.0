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

type SaveState = "idle" | "pending" | "saving" | "saved" | "error";

type Props = {
  proposalPageId: string;
  blocksDatabaseId: string;
  title: string;
  slug: string;
  status: ProposalStatus;
  initialBlocks: EditorBlock[];
};

const AUTOSAVE_MS = 1500;

export function ProposalEditor({
  proposalPageId,
  blocksDatabaseId,
  title,
  slug,
  status,
  initialBlocks,
}: Props) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
  const [saveState, setSaveState] = useState<SaveState>("idle");

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
    setBlocks((prev) => prev.filter((b) => b.id !== id));
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
        const res = await saveProposalAction(
          proposalPageId,
          blocksDatabaseId,
          toSaveInput(blocksRef.current)
        );
        if (!res.ok) {
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

      <div className="mx-auto w-full max-w-editor px-s5 py-s10 flex flex-col">
        {blocks.map((block, i) => (
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
            </BlockFrame>
            {/* Insert points only between/after non-locked regions and never make
                the locked header/intro/pricing movable into the middle. */}
            <InsertPoint onInsert={(type) => insertAfter(i, type)} />
          </div>
        ))}
      </div>
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
    <div className="sticky top-s9 z-20 flex items-center justify-between gap-s4 h-s8 px-s4 pb-px bg-white/85 backdrop-blur border-b border-prim/8">
      <div className="flex items-center gap-s2 min-w-0">
        <a href="/tools" className="grid place-items-center size-s5 rounded-md text-prim/50 hover:bg-prim/8 hover:text-prim transition-colors">
          <Icon name="chevron-left" size="md" />
        </a>
        <span className="font-body font-medium text-l1 text-prim truncate">{title}</span>
        <StatusBadge status={status} />
      </div>
      <div className="flex items-center gap-s3">
        <button
          type="button"
          onClick={onSave}
          className={`font-body text-l2 transition-colors ${
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
          className="inline-flex items-center h-s4 px-s2 rounded-pill bg-prim text-white font-body font-medium text-l2 hover:opacity-85 transition-opacity"
        >
          Preview
        </a>
        <DeleteButton proposalPageId={proposalPageId} />
      </div>
    </div>
  );
}
