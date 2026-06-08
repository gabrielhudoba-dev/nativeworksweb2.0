"use client";

import { useState } from "react";
import { createBlankProposalAction } from "./proposals/actions";

export function NewProposalButton() {
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await createBlankProposalAction();
      }}
      className="inline-flex items-center pb-px h-s7 px-s4 rounded-pill bg-prim text-white font-body font-medium text-l1 hover:opacity-85 transition-opacity disabled:opacity-60 cursor-pointer"
    >
      {loading ? "Creating…" : "New proposal"}
    </button>
  );
}
