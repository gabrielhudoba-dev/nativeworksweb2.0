"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavPrimPill } from "@/app/components/molecules";
import { Heading, Text } from "@/app/components/atoms";
import { useNavContext } from "./NavigationProvider";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Collective", href: "/collective" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Process & Insights", href: "/process-insights" },
];

export function Navigation() {
  const { open, setOpen } = useNavContext();
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <NavPrimPill
        open={open}
        onToggle={() => setOpen((o) => !o)}
        onLogoClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className={[
          "fixed inset-0 z-40 bg-white overflow-y-auto",
          "transition-[opacity,transform] duration-500 ease-out",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Hlavné menu"
      >
        <div className="h-s13" />

        <nav aria-label="Site navigation">
          <ul className="flex flex-col">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <li key={href} className="relative group">
                  <div className={[
                    "absolute top-[-8px] bottom-[-8px] inset-x-s2 rounded-lg bg-brand/10 transition-opacity duration-200",
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                  ].join(" ")} />
                  <div className="max-w-page mx-auto">
                    <Link
                      href={href}
                      className="relative flex items-center px-s11 h-[116px]"
                      onClick={() => setOpen(false)}
                      tabIndex={open ? 0 : -1}
                    >
                      <span className="font-display font-medium text-numb1 text-prim inline-block tracking-[-0.02em]">{label}</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="max-w-page mx-auto">
          <div className="px-s11 mt-s11 pb-s7 flex flex-col gap-s2">
            <Text variant="l2" className="opacity-50">Contacts</Text>
            <span className="font-display font-medium text-h5 tracking-[-0.02em] text-prim inline-block translate-y-[4px]">
              hello@natiweworks.eu
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
