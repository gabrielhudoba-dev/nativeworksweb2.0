"use client";

import Link from "next/link";
import { Logo, Text } from "@/app/components/atoms";
import { SocialLink } from "@/app/components/molecules/SocialLink";
import { useSquircle } from "@/app/hooks/useSquircle";

const SOCIAL: { platform: Parameters<typeof SocialLink>[0]["platform"]; href: string }[] = [
  { platform: "linkedin", href: "https://linkedin.com" },
  { platform: "instagram", href: "https://instagram.com" },
  { platform: "x", href: "https://x.com" },
];

export function Footer() {
  const { ref, style } = useSquircle(21, 0.6);

  return (
    <footer ref={ref} style={style} className="grain bg-brand/10 text-prim mx-s2 mb-s2">
      <div className="px-s4 sm:px-s7 pt-s6 pb-s6">

        {/* Top row — logo + social */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-s6 gap-s4 sm:gap-0">
          <div className="flex flex-col gap-s3">
            <Link href="/" aria-label="Native Works">
              <Logo size="md" className="h-s6 w-auto" />
            </Link>
            <Text variant="p3">
              New era of digital product design.
            </Text>
          </div>
          <div className="flex items-center gap-s2">
            {SOCIAL.map(({ platform, href }) => (
              <SocialLink key={platform} platform={platform} href={href} />
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-s6 sm:pt-s9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-s2 sm:gap-0">
          <div className="flex items-center gap-s4">
            <Link href="/terms" className="font-body font-normal text-l3 text-prim translate-y-[5.5px] hover:text-prim/60 transition-colors">
              Terms of service
            </Link>
            <Link href="/privacy" className="font-body font-normal text-l3 text-prim translate-y-[5.5px] hover:text-prim/60 transition-colors">
              Privacy policy
            </Link>
          </div>
          <Text variant="l3">
            © 2025–{new Date().getFullYear()} Native Works
          </Text>
        </div>

      </div>
    </footer>
  );
}
