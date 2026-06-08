"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusBadge } from "../../components/StatusBadge";
import { ProposalRowMenu } from "./ProposalRowMenu";
import { renameProposalAction } from "./actions";
import type { ProposalStatus } from "@/lib/notion-proposals";

type Props = {
  notionPageId: string;
  title: string;
  status: ProposalStatus;
};

export function ProposalRow({ notionPageId, title, status }: Props) {
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(title);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function startRename() {
    setRenameValue(title);
    setRenaming(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  async function commitRename() {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === title) { setRenaming(false); return; }
    setBusy(true);
    try {
      await renameProposalAction(notionPageId, trimmed);
      router.refresh();
    } finally {
      setBusy(false);
      setRenaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); commitRename(); }
    if (e.key === "Escape") { setRenaming(false); }
  }

  return (
    <li className="grain group relative flex items-center gap-s2 rounded-[12px] bg-surface hover:brightness-[0.97] transition-all">
      {!renaming && (
        <Link
          href={`/tools/proposals/${notionPageId}/edit`}
          className="absolute inset-0 z-10 rounded-[12px]"
          aria-label={title || "Untitled proposal"}
        />
      )}

      <div className="relative z-0 flex-1 flex items-center justify-between gap-s4 px-s4 py-s3 min-w-0 pointer-events-none">
        {renaming ? (
          <input
            ref={inputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={handleKeyDown}
            disabled={busy}
            autoFocus
            className="pointer-events-auto flex-1 min-w-0 bg-transparent font-body text-p1 text-prim outline-none border-b border-prim/30 focus:border-prim/60 disabled:opacity-50 transition-colors"
          />
        ) : (
          <p className="font-body text-p1 text-prim truncate min-w-0">{title}</p>
        )}
        {!renaming && <StatusBadge status={status} />}
      </div>

      <div className="pr-s2 relative z-20 self-stretch flex items-center">
        <ProposalRowMenu
          proposalPageId={notionPageId}
          title={title}
          onRename={startRename}
        />
      </div>
    </li>
  );
}
