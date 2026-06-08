"use client";

import { useState } from "react";
import { OPTIONAL_BLOCK_TYPES, BLOCK_LABELS, type BlockType } from "../../../blocks/types";

const TYPE_HINT: Record<string, string> = {
  description: "A heading and a paragraph of detail",
  benefits: "A checked list of outcomes",
  scope: "A checked list of deliverables",
  process: "Numbered stage cards",
};

/** The "+" affordance between blocks — opens a picker of optional block types. */
export function InsertPoint({ onInsert }: { onInsert: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative group/insert h-s4 flex items-center justify-center">
      {/* Hover line */}
      <span className="absolute inset-x-0 top-1/2 h-px bg-brand/30 opacity-0 group-hover/insert:opacity-100 transition-opacity" />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Insert block"
        className={`relative z-10 grid place-items-center size-s4 rounded-pill bg-white border border-prim/15 text-prim/50 hover:border-brand hover:text-brand shadow-sm transition-all ${
          open ? "opacity-100 border-brand text-brand" : "opacity-0 group-hover/insert:opacity-100"
        }`}
      >
        <span className="text-[18px] leading-none">+</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute z-30 top-[calc(100%+4px)] left-1/2 -translate-x-1/2 w-[280px] p-s1 rounded-lg bg-white border border-prim/10 shadow-lg flex flex-col">
            {OPTIONAL_BLOCK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onInsert(type);
                  setOpen(false);
                }}
                className="flex flex-col gap-[2px] items-start text-left px-s2 py-s2 rounded-md hover:bg-surface transition-colors cursor-pointer"
              >
                <span className="font-body font-medium text-l1 text-prim">{BLOCK_LABELS[type]}</span>
                <span className="font-body text-l3 text-prim/45">{TYPE_HINT[type]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
