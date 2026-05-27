"use client";

import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@developer-hub/liquid-glass";
import { IconButton } from "@/app/components/atoms/IconButton";

type Props = {
  open: boolean;
  onToggle: () => void;
  onLogoClick?: () => void;
  /** Renders inline without fixed positioning — for catalog/preview use */
  static?: boolean;
};

export function NavPrimPill({ open, onToggle, onLogoClick, static: isStatic }: Props) {
  return (
    <div className={isStatic ? "flex justify-center" : "fixed top-0 left-0 right-0 z-50 flex justify-center pt-s5"}>
      <GlassCard cornerRadius={9999} padding="0px" blurAmount={0} displacementScale={80}>
        <div className="flex items-center justify-between pl-s5 pr-s6 h-[64px] w-[300px] bg-[#D9D9D9]/20">
          <Link
            href="/"
            aria-label="Native Works – späť na úvod"
            onClick={onLogoClick}
          >
            <Image
              src="/images/nativeWorksLogoFull.svg"
              alt="Native Works"
              width={95}
              height={36}
              priority
              unoptimized
            />
          </Link>
          <IconButton
            icon={open ? "close" : "menu"}
            label={open ? "Zatvoriť menu" : "Otvoriť menu"}
            onClick={onToggle}
          />
        </div>
      </GlassCard>
    </div>
  );
}
