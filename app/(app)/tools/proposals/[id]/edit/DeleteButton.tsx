"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/atoms";
import { deleteProposalAction } from "../../actions";

/**
 * Delete button in the editor toolbar — shows as three-dot dropdown.
 * First click opens the menu, second click (Confirm) actually deletes
 * and navigates back to /tools.
 */
export function DeleteButton({ proposalPageId }: { proposalPageId: string }) {
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

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setDeleting(true);
    try {
      await deleteProposalAction(proposalPageId);
      router.push("/tools");
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setConfirming(false); }}
        aria-label="Proposal options"
        className="grid place-items-center size-s6 rounded-md text-prim/40 hover:bg-prim/8 hover:text-prim transition-colors"
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
