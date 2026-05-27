"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavPrimPill } from "@/app/components/molecules";
import { Text } from "@/app/components/atoms";
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
        <div className="h-[104px]" />

        <nav aria-label="Site navigation">
          <ul className="flex flex-col">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <li key={href} className="relative group">
                  <div className={[
                    "absolute top-[-4px] bottom-[-4px] inset-x-s5 rounded-lg bg-brand/10 transition-opacity duration-200",
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                  ].join(" ")} />
                  <div className="max-w-s15 mx-auto">
                    <Link
                      href={href}
                      className="relative block px-s9 py-[28px] font-display font-medium text-[60px] leading-[0.9] tracking-[-0.02em] text-prim"
                      onClick={() => setOpen(false)}
                      tabIndex={open ? 0 : -1}
                    >
                      {label}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="max-w-s15 mx-auto">
          <div className="px-s9 mt-s9 pb-s8 flex flex-col gap-s5">
            <Text variant="l2" className="opacity-50">Contacts</Text>
            <span className="font-display font-medium text-[24px] leading-[0.9] tracking-[-0.02em] text-prim">
              hello@natiweworks.eu
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
