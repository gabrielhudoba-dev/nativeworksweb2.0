"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/atoms";
import { deleteProposalAction, duplicateProposalAction } from "./actions";

type Props = { proposalPageId: string; title: string; onRename: () => void; onDuplicate?: () => void };

export function ProposalRowMenu({ proposalPageId, title, onRename, onDuplicate }: Props) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setOpen((o) => !o);
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await deleteProposalAction(proposalPageId);
      router.refresh();
      setConfirmDelete(false);
    } catch {
      setBusy(false);
    }
  }

  const dropdown = open && typeof document !== "undefined" ? createPortal(
    <div
      ref={dropdownRef}
      style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 9999 }}
      className="w-52 bg-white border border-prim/10 rounded-xl shadow-lg py-1"
    >
      <button
        type="button"
        onClick={() => router.push(`/tools/proposals/${proposalPageId}/edit`)}
        className="flex items-center gap-s2 w-full text-left px-s3 py-[10px] font-body text-l2 text-prim/70 hover:bg-prim/5 hover:text-prim transition-colors"
      >
        <Icon name="pencil-simple" size="sm" />
        Edit
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); onRename(); }}
        className="flex items-center gap-s2 w-full text-left px-s3 py-[10px] font-body text-l2 text-prim/70 hover:bg-prim/5 hover:text-prim transition-colors"
      >
        <Icon name="text-t" size="sm" />
        Rename
      </button>
      <button
        type="button"
        disabled={duplicating}
        onClick={async (e) => {
          e.preventDefault(); e.stopPropagation();
          setOpen(false);
          setDuplicating(true);
          try {
            await duplicateProposalAction(proposalPageId);
            router.refresh();
            onDuplicate?.();
          } finally {
            setDuplicating(false);
          }
        }}
        className="flex items-center gap-s2 w-full text-left px-s3 py-[10px] font-body text-l2 text-prim/70 hover:bg-prim/5 hover:text-prim transition-colors disabled:opacity-40"
      >
        <Icon name="copy" size="sm" />
        {duplicating ? "Duplicating…" : "Duplicate"}
      </button>
      <div className="my-1 border-t border-prim/8" />
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); setConfirmDelete(true); }}
        className="flex items-center gap-s2 w-full text-left px-s3 py-[10px] font-body text-l2 text-red-500 hover:bg-red-50 transition-colors"
      >
        <Icon name="trash" size="sm" />
        Delete
      </button>
    </div>,
    document.body
  ) : null;

  const deleteModal = confirmDelete && typeof document !== "undefined" ? createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-s4"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!busy) setConfirmDelete(false); }}
    >
      <div className="absolute inset-0 bg-prim/20 backdrop-blur-[2px]" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[340px] p-s5 flex flex-col gap-s4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center size-[40px] rounded-full bg-red-50 text-red-500">
          <Icon name="trash" size="md" />
        </div>
        <div className="flex flex-col gap-[6px]">
          <h3 className="font-display font-medium text-h5 text-prim leading-tight">Delete proposal?</h3>
          <p className="font-body text-p2 text-prim/50 leading-snug">
            <span className="font-medium text-prim/70">&ldquo;{title}&rdquo;</span> will be permanently deleted. This cannot be undone.
          </p>
        </div>
        <div className="flex gap-s2 pt-s1">
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirmDelete(false)}
            className="flex-1 h-s7 rounded-pill border border-prim/15 font-body font-medium text-l1 text-prim/60 hover:bg-prim/5 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleDelete}
            className="flex-1 h-s7 rounded-pill bg-red-500 text-white font-body font-medium text-l1 hover:bg-red-600 transition-colors disabled:opacity-40"
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
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
        className="grid place-items-center size-s6 rounded-md text-prim/60 hover:bg-prim/8 hover:text-prim transition-colors"
      >
        <Icon name="dots-three-vertical" size="md" />
      </button>
      {dropdown}
      {deleteModal}
    </div>
  );
}
