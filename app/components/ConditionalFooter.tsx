"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/app/components/organisms";

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/catalog") return null;
  return <Footer />;
}
