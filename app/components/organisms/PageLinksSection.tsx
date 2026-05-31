"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heading } from "@/app/components/atoms";

const LINKS = [
  { label: "Collective", href: "/collective" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Process", href: "/process-insights" },
];

export function PageLinksSection() {
  const pathname = usePathname();
  const links = LINKS.filter((l) => l.href !== pathname);

  return (
    <section className="px-s11 pb-s12 max-w-page mx-auto">
      {links.map(({ label, href }) => (
        <div key={href}>
          <Link href={href} className="block py-s3">
            <Heading variant="h2" as="span">{label}</Heading>
          </Link>
        </div>
      ))}
    </section>
  );
}
