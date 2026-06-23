"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlassCard } from "@developer-hub/liquid-glass";
import { Logo, IconButton } from "@/app/components/atoms";

export type NavItem = { label: string; href: string };

type Props = {
  items: NavItem[];
  email?: string;
  static?: boolean;
};

const linkCls =
  "font-body font-medium text-[14px] leading-[16px] whitespace-nowrap transition-opacity duration-150 ease-system";

export function NavPrimPill({ items, email = "hello@nativeworks.eu", static: isStatic }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div
        className={
          isStatic
            ? "flex justify-center"
            : "fixed top-0 left-0 right-0 z-50 flex justify-center pt-s1 sm:pt-s2 px-[12px] sm:px-0"
        }
      >
        <div className="w-full sm:w-auto">
          <GlassCard
            cornerRadius={9999}
            padding="0px"
            blurAmount={0}
            displacementScale={80}
            className="nav-pill-mobile w-full sm:w-auto"
          >
            <div
              className="relative flex items-center gap-s2 sm:gap-s4 pl-s2 pr-s3 sm:pl-s3 sm:pr-s5 h-s8 bg-[#D9D9D9]/20 w-full justify-between sm:w-auto sm:justify-start"
              style={{ textShadow: "none" }}
            >
              <Link href="/" aria-label="Native Works – späť na úvod" className="shrink-0" onClick={() => setOpen(false)}>
                <Logo size="sm" priority className="brightness-0" />
              </Link>


{/* Desktop nav */}
              <nav className="hidden sm:flex items-center gap-s4">
                {items.map((it) => (
                  <a key={it.href} href={it.href} className={`${linkCls} text-black hover:opacity-70 -translate-y-px`}>
                    {it.label}
                  </a>
                ))}
              </nav>

              {/* Mobile hamburger */}
              <div className="sm:hidden">
                <IconButton
                  icon={open ? "close" : "menu"}
                  label={open ? "Zavrieť menu" : "Otvoriť menu"}
                  onClick={() => setOpen((v) => !v)}
                />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Mobile fullscreen drawer — web 1.0 design */}
      {!isStatic && (
        <div
          className={[
            "sm:hidden fixed inset-0 z-40 bg-white overflow-y-auto",
            "transition-[opacity,transform] duration-300 ease-system",
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-3 pointer-events-none",
          ].join(" ")}
          aria-hidden={!open}
          role="dialog"
          aria-modal="true"
          aria-label="Hlavné menu"
        >
          {/* Space for pill */}
          <div className="h-[100px]" />

          <nav aria-label="Site navigation">
            <ul className="flex flex-col">
              {items.map(({ label, href }) => {
                const active = pathname === href;
                return (
                  <li key={href} className="relative group">
                    <div className={[
                      "absolute top-[-8px] bottom-[-8px] inset-x-s2 rounded-lg bg-brand/10 transition-opacity duration-150",
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    ].join(" ")} />
                    <Link
                      href={href}
                      className="relative flex items-center px-page h-[72px]"
                      onClick={() => setOpen(false)}
                      tabIndex={open ? 0 : -1}
                    >
                      <span className="font-display font-medium text-h2 text-prim inline-block tracking-[-0.02em]">
                        {label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="px-page mt-s6 pb-s9 flex flex-col gap-s2">
            <a href={`mailto:${email}`} className="font-display font-medium text-h5 tracking-[-0.02em] text-prim inline-block translate-y-[4px] transition-opacity hover:opacity-70" tabIndex={open ? 0 : -1}>
              {email}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
