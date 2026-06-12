"use client";

import Link from "next/link";
import { GlassCard } from "@developer-hub/liquid-glass";
import { Logo } from "@/app/components/atoms";

export type NavItem = { label: string; href: string };

type Props = {
  items: NavItem[];
  /** Renders inline without fixed positioning — for catalog/preview use */
  static?: boolean;
};

const linkCls =
  "font-body font-medium text-[14px] leading-[16px] whitespace-nowrap transition-opacity duration-150 ease-system";

export function NavPrimPill({ items, static: isStatic }: Props) {
  return (
    <div className={isStatic ? "flex justify-center" : "fixed top-0 left-0 right-0 z-50 flex justify-center pt-s3 sm:pt-s2 px-[calc(var(--gutter)_-_4px)] sm:px-0"}>
      <div className="w-full sm:w-auto">
        <GlassCard cornerRadius={9999} padding="0px" blurAmount={0} displacementScale={80} className="w-full sm:w-auto">
          <div
            className="flex items-center gap-s2 sm:gap-s5 pl-s2 pr-s2 sm:pl-s3 sm:pr-s5 h-s8 bg-[#D9D9D9]/20 w-full justify-between sm:w-auto sm:justify-start"
            style={{ textShadow: "none" }}
          >
            <Link href="/" aria-label="Native Works – späť na úvod" className="shrink-0">
              <Logo size="sm" priority />
            </Link>

            <nav className="flex items-center gap-s2 sm:gap-s4">
              {items.map((it) => (
                <a key={it.href} href={it.href} className={`${linkCls} text-[#090E3A] hover:opacity-70`}>
                  {it.label}
                </a>
              ))}
            </nav>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
