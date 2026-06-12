"use client";

import { NavPrimPill, type NavItem } from "@/app/components/molecules";
import type { SiteContent } from "@/lib/content";

type Props = { content: SiteContent };

export function Navigation({ content }: Props) {
  const items: NavItem[] = [
    { label: content.nav_work ?? "Work", href: "/#work" },
    { label: content.nav_services ?? "Services", href: "/#services" },
    { label: content.nav_process ?? "Process", href: "/#stages" },
  ];

  return <NavPrimPill items={items} />;
}
