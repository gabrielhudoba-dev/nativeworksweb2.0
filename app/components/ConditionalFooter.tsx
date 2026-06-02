"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/app/components/organisms";
import type { SiteContent } from "@/lib/content";

type Props = { content: SiteContent };

export function ConditionalFooter({ content }: Props) {
  const pathname = usePathname();
  if (pathname === "/catalog") return null;
  return <Footer content={content} />;
}
