"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/atoms";
import { MenuPopover, MenuItem } from "@/app/(app)/components/MenuPopover";
import { deleteProposalAction, duplicateProposalAction } from "../../actions";

export function DeleteButton({ proposalPageId, title }: { proposalPageId: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteProposalAction(proposalPageId);
      router.push("/tools");
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  async function handleDuplicate() {
    setDuplicating(true);
    try {
      const res = await duplicateProposalAction(proposalPageId);
      if (res.ok) router.push("/tools");
    } finally {
      setDuplicating(false);
      setOpen(false);
    }
  }

  const deleteModal = confirmDelete && typeof document !== "undefined" ? createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-s4"
      onClick={() => { if (!deleting) setConfirmDelete(false); }}
    >
      <div className="absolute inset-0 bg-prim/20 backdrop-blur-[2px]" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[340px] p-s5 flex flex-col gap-s4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-[6px]">
          <h3 className="font-display font-medium text-h5 text-prim leading-tight">Delete proposal?</h3>
          <p className="font-body text-p2 text-prim/50 leading-snug">
            <span className="font-medium text-prim/70">&ldquo;{title}&rdquo;</span> will be permanently deleted. This cannot be undone.
          </p>
        </div>
        <div className="flex gap-s2 pt-s1">
          <button
            type="button"
            disabled={deleting}
            onClick={() => setConfirmDelete(false)}
            className="flex-1 h-s7 rounded-pill border border-prim/15 font-body font-medium text-l1 text-prim/60 hover:bg-prim/5 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="flex-1 h-s7 rounded-pill bg-red-500 text-white font-body font-medium text-l1 hover:bg-red-600 transition-colors disabled:opacity-40"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); }}
        aria-label="Proposal options"
        className="grid place-items-center size-s5 rounded-pill text-prim/60 hover:bg-prim/8 hover:text-prim transition-colors"
      >
        <Icon name="dots-three-vertical" size="md" />
      </button>

      <MenuPopover open={open} onClose={() => setOpen(false)}>
        <MenuItem
          label={duplicating ? "Duplicating…" : "Duplicate"}
          icon={<Icon name="copy" size="sm" />}
          disabled={duplicating}
          onClick={handleDuplicate}
        />
        <MenuItem
          label="Delete proposal"
          icon={<Icon name="trash" size="sm" />}
          danger
          confirming={false}
          disabled={false}
          onClick={() => { setOpen(false); setConfirmDelete(true); }}
        />
      </MenuPopover>

      {deleteModal}
    </div>
  );
}
