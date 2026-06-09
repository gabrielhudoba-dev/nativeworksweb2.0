"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Icon } from "@/app/components/atoms";
import { searchDealsAction, linkDealAction } from "../../actions";

type Deal = { pageId: string; title: string };

export function DealPicker({
  proposalPageId,
  initialDealPageId,
  initialDealTitle,
}: {
  proposalPageId: string;
  initialDealPageId: string | null;
  initialDealTitle: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Deal[]>([]);
  const [searching, setSearching] = useState(false);
  const [linked, setLinked] = useState<Deal | null>(
    initialDealPageId && initialDealTitle
      ? { pageId: initialDealPageId, title: initialDealTitle }
      : null
  );
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Open → focus input
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        setResults(await searchDealsAction(query));
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, open]);

  function pick(deal: Deal) {
    setLinked(deal);
    setOpen(false);
    setQuery("");
    startTransition(() => linkDealAction(proposalPageId, deal.pageId));
  }

  function unlink() {
    setLinked(null);
    startTransition(() => linkDealAction(proposalPageId, null));
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      {linked ? (
        <div className="flex items-center gap-s1">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-[5px] h-s4 px-s2 rounded-pill bg-prim/6 hover:bg-prim/10 transition-colors cursor-pointer"
          >
            <Icon name="link" size="sm" className="text-prim/40" />
            <span className="font-body text-l2 text-prim/60 max-w-[160px] truncate">
              {isPending ? "Saving…" : linked.title}
            </span>
          </button>
          <button
            type="button"
            onClick={unlink}
            className="grid place-items-center size-s4 rounded-pill text-prim/30 hover:text-prim/60 hover:bg-prim/8 transition-colors cursor-pointer"
            title="Unlink deal"
          >
            <Icon name="x" size="sm" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-[5px] h-s4 px-s2 rounded-pill text-prim/35 hover:text-prim/60 hover:bg-prim/8 transition-colors cursor-pointer"
        >
          <Icon name="link" size="sm" />
          <span className="font-body text-l2">Link deal</span>
        </button>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-prim/10 z-50 overflow-hidden">
          <div className="p-s2 border-b border-prim/8">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search deals…"
              className="w-full h-s5 px-s2 font-body text-l1 text-prim bg-surface rounded-md outline-none placeholder:text-prim/35"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {searching ? (
              <div className="px-s3 py-s2 font-body text-l2 text-prim/40">Searching…</div>
            ) : results.length === 0 ? (
              <div className="px-s3 py-s2 font-body text-l2 text-prim/40">No deals found</div>
            ) : (
              results.map((d) => (
                <button
                  key={d.pageId}
                  type="button"
                  onClick={() => pick(d)}
                  className="w-full text-left px-s3 py-s2 font-body text-l1 text-prim hover:bg-surface transition-colors cursor-pointer truncate"
                >
                  {d.title}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
