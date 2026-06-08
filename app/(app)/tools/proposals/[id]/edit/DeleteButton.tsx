"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/atoms";
import { MenuPopover, MenuItem } from "@/app/(app)/components/MenuPopover";
import { deleteProposalAction, duplicateProposalAction } from "../../actions";

export function DeleteButton({ proposalPageId }: { proposalPageId: string }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return; }
    setDeleting(true);
    try {
      await deleteProposalAction(proposalPageId);
      router.push("/tools");
    } catch {
      setDeleting(false);
      setConfirming(false);
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

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setConfirming(false); }}
        aria-label="Proposal options"
        className="grid place-items-center size-s6 rounded-pill text-prim/60 hover:bg-prim/8 hover:text-prim transition-colors"
      >
        <Icon name="dots-three-vertical" size="md" />
      </button>

      <MenuPopover open={open} onClose={() => { setOpen(false); setConfirming(false); }}>
        <MenuItem
          label={duplicating ? "Duplicating…" : "Duplicate"}
          icon={<Icon name="copy" size="sm" />}
          disabled={duplicating}
          onClick={handleDuplicate}
        />
        <MenuItem
          label={deleting ? "Deleting…" : confirming ? "Confirm — delete?" : "Delete proposal"}
          icon={<Icon name="trash" size="sm" />}
          danger
          confirming={confirming}
          disabled={deleting}
          onClick={handleDelete}
        />
      </MenuPopover>
    </div>
  );
}
