"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heading } from "@/app/components/atoms";

const LINKS = [
  { label: "Collective", href: "/collective" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Capabilities", href: "/capabilities" },
];

export function PageLinksSection() {
  const pathname = usePathname();
  const links = LINKS.filter((l) => l.href !== pathname);

  return (
    <section className="w-full px-page pb-s6 sm:pb-s12 max-w-page mx-auto">
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
