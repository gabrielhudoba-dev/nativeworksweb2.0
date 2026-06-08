"use client";

import { Logo } from "@/app/components/atoms";
import { logout } from "./actions";

export function StudioHeader({ name }: { name: string | null }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-s9 px-s4 bg-surface/80 backdrop-blur border-b border-prim/8">
      <a href="/tools" className="flex items-center gap-s2">
        <Logo size="sm" />
        <span className="font-body font-medium text-l2 text-prim/50">Native Tools</span>
      </a>
      <div className="flex items-center gap-s3">
        {name && <span className="font-body text-l2 text-prim/50">{name}</span>}
        <button
          type="button"
          onClick={() => logout()}
          className="font-body text-l2 text-prim/60 hover:text-prim transition-colors cursor-pointer"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
