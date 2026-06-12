"use client";

import Link from "next/link";
import { Logo, Text } from "@/app/components/atoms";
import { SocialLink } from "@/app/components/molecules/SocialLink";
import { useSquircle } from "@/app/hooks/useSquircle";
import type { SiteContent } from "@/lib/content";

type Props = { content: SiteContent };

export function Footer({ content }: Props) {
  const { ref, style } = useSquircle(21, 0.6);

  return (
    <footer ref={ref} style={style} className="grain bg-brand/10 text-prim mx-s2 mb-s2">
      <div className="px-s4 sm:px-s7 pt-s6 pb-s6">

        {/* Two rows aligned across: logo · LinkedIn (top) — tagline · copyright (bottom) */}
        <div className="flex flex-col gap-s3">
          <div className="flex items-center justify-between gap-s4">
            <Link href="/" aria-label="Native Works">
              <Logo size="md" className="h-s6 w-auto" />
            </Link>
            <SocialLink platform="linkedin" href="https://linkedin.com" />
          </div>
          <div className="flex items-center justify-between gap-s4">
            <Text variant="p3">
              {content.footer_tagline ?? "New era of digital product design."}
            </Text>
            <div className="flex items-center gap-s4">
              <a
                href={`mailto:${content.footer_email ?? "hello@nativeworks.eu"}`}
                className="transition-opacity hover:opacity-70"
              >
                <Text variant="p3">{content.footer_email ?? "hello@nativeworks.eu"}</Text>
              </a>
              <Text variant="p3" className="text-right">
                © {new Date().getFullYear()}–3025
              </Text>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
