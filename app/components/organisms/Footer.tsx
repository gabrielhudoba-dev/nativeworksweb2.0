import Link from "next/link";
import { Logo, Text } from "@/app/components/atoms";
import { SocialLink } from "@/app/components/molecules/SocialLink";

const SOCIAL: { platform: Parameters<typeof SocialLink>[0]["platform"]; href: string }[] = [
  { platform: "linkedin", href: "https://linkedin.com" },
  { platform: "instagram", href: "https://instagram.com" },
  { platform: "x", href: "https://x.com" },
];

export function Footer() {
  return (
    <footer className="bg-brand/10 text-prim mx-s5 mb-s5 rounded-lg overflow-hidden">
      <div className="px-s8 pt-s8 pb-s5 opacity-100">

        {/* Top row — logo + social */}
        <div className="flex items-start justify-between mb-s8">
          <div className="flex flex-col gap-s5">
            <Link href="/" aria-label="Native Works">
              <Logo size="md" className="h-s8 w-auto opacity-60" />
            </Link>
            <p className="font-body font-normal text-p3 text-prim/50">
              New era of digital product design.
            </p>
          </div>
          <div className="flex items-center gap-s5">
            {SOCIAL.map(({ platform, href }) => (
              <SocialLink key={platform} platform={platform} href={href} />
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-prim/10 pt-s5 flex items-center justify-between">
          <div className="flex items-center gap-s7">
            <Link href="/terms" className="font-body font-normal text-l3 text-prim/40 hover:text-prim/70 transition-colors">
              Terms of service
            </Link>
            <Link href="/privacy" className="font-body font-normal text-l3 text-prim/40 hover:text-prim/70 transition-colors">
              Privacy policy
            </Link>
          </div>
          <Text variant="l3" className="text-prim/40">
            © 2025–{new Date().getFullYear()} Native Works
          </Text>
        </div>

      </div>
    </footer>
  );
}
