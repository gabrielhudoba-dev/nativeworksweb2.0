"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/atoms";
import { deleteProposalAction } from "./actions";

type Props = {
  proposalPageId: string;
  title: string;
};

/**
 * Three-dot context menu for a proposal row in the list.
 * Clicking outside or pressing Escape closes it.
 * Delete requires a second click to confirm.
 */
export function ProposalRowMenu({ proposalPageId, title }: Props) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirming(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); setConfirming(false); }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault(); // don't follow the parent <Link>
    e.stopPropagation();
    setOpen((o) => !o);
    setConfirming(false);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setDeleting(true);
    try {
      await deleteProposalAction(proposalPageId);
      router.refresh();
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      onClick={(e) => e.preventDefault()} // prevent <Link> navigation from the wrapper
    >
      <button
        type="button"
        onClick={toggle}
        aria-label="Proposal options"
        className="grid place-items-center size-s6 rounded-md text-prim/35 hover:bg-prim/8 hover:text-prim transition-colors"
      >
        <Icon name="dots-three-vertical" size="md" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-s1 w-52 bg-white border border-prim/10 rounded-lg shadow-lg overflow-hidden z-30">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className={`flex items-center gap-s2 w-full text-left px-s3 py-[10px] font-body text-l2 transition-colors disabled:opacity-40 ${
              confirming
                ? "text-red-600 bg-red-50 hover:bg-red-100"
                : "text-red-500 hover:bg-red-50"
            }`}
          >
            <Icon name="trash" size="sm" />
            {deleting ? "Deleting…" : confirming ? "Confirm — delete?" : "Delete proposal"}
          </button>
        </div>
      )}
    </div>
  );
}
