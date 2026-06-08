"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/atoms";
import { deleteProposalAction, renameProposalAction } from "./actions";

type Props = {
  proposalPageId: string;
  title: string;
};

type Mode = "menu" | "rename" | "confirm-delete";

export function ProposalRowMenu({ proposalPageId, title }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("menu");
  const [renameValue, setRenameValue] = useState(title);
  const [busy, setBusy] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const renameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setMode("menu");
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); setMode("menu"); }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open && mode === "rename") renameRef.current?.select();
  }, [open, mode]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((o) => !o);
    setMode("menu");
    setRenameValue(title);
  }

  async function handleRename(e: React.FormEvent) {
    e.preventDefault();
    if (!renameValue.trim() || renameValue.trim() === title) { setOpen(false); setMode("menu"); return; }
    setBusy(true);
    try {
      await renameProposalAction(proposalPageId, renameValue.trim());
      router.refresh();
      setOpen(false);
      setMode("menu");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await deleteProposalAction(proposalPageId);
      router.refresh();
    } catch {
      setBusy(false);
      setMode("menu");
    }
  }

  const dropdown = open && typeof document !== "undefined" ? createPortal(
    <div
      ref={dropdownRef}
      style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 9999 }}
      className="w-52 bg-white border border-prim/10 rounded-xl shadow-lg py-1"
    >
      {mode === "menu" && (
        <>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); router.push(`/tools/proposals/${proposalPageId}/edit`); }}
            className="flex items-center gap-s2 w-full text-left px-s3 py-[10px] font-body text-l2 text-prim/70 hover:bg-prim/5 hover:text-prim transition-colors"
          >
            <Icon name="pencil-simple" size="sm" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMode("rename")}
            className="flex items-center gap-s2 w-full text-left px-s3 py-[10px] font-body text-l2 text-prim/70 hover:bg-prim/5 hover:text-prim transition-colors"
          >
            <Icon name="text-t" size="sm" />
            Rename
          </button>
          <div className="my-1 border-t border-prim/8" />
          <button
            type="button"
            onClick={() => setMode("confirm-delete")}
            className="flex items-center gap-s2 w-full text-left px-s3 py-[10px] font-body text-l2 text-red-500 hover:bg-red-50 transition-colors"
          >
            <Icon name="trash" size="sm" />
            Delete
          </button>
        </>
      )}

      {mode === "rename" && (
        <form onSubmit={handleRename} className="px-s3 py-s2 flex flex-col gap-s2">
          <input
            ref={renameRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            disabled={busy}
            className="w-full rounded-md border border-prim/15 px-s2 py-[7px] font-body text-l2 text-prim outline-none focus:border-prim/40 disabled:opacity-50"
            placeholder="Proposal name"
          />
          <div className="flex gap-s2">
            <button
              type="submit"
              disabled={busy || !renameValue.trim()}
              className="flex-1 rounded-md bg-prim text-white font-body text-l3 py-[7px] hover:opacity-85 transition-opacity disabled:opacity-40"
            >
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setMode("menu")}
              className="flex-1 rounded-md border border-prim/15 font-body text-l3 py-[7px] text-prim/60 hover:bg-prim/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {mode === "confirm-delete" && (
        <div className="px-s3 py-s2 flex flex-col gap-s2">
          <p className="font-body text-l2 text-prim/60">Delete "{title}"?</p>
          <div className="flex gap-s2">
            <button
              type="button"
              disabled={busy}
              onClick={handleDelete}
              className="flex-1 rounded-md bg-red-500 text-white font-body text-l3 py-[7px] hover:bg-red-600 transition-colors disabled:opacity-40"
            >
              {busy ? "Deleting…" : "Delete"}
            </button>
            <button
              type="button"
              onClick={() => setMode("menu")}
              className="flex-1 rounded-md border border-prim/15 font-body text-l3 py-[7px] text-prim/60 hover:bg-prim/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative shrink-0" onClick={(e) => e.preventDefault()}>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label="Proposal options"
        className="grid place-items-center size-s6 rounded-md text-prim/35 hover:bg-prim/8 hover:text-prim transition-colors"
      >
        <Icon name="dots-three-vertical" size="md" />
      </button>
      {dropdown}
    </div>
  );
}
