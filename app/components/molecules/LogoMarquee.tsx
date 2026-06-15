"use client";

import Image from "next/image";

// alternated: icon, wordmark, icon, wordmark...
// maxH calibrated per-logo for equal optical weight
// cellPx: overrides px-s4 for wide wordmarks where padding is the binding width constraint
const LOGOS: { name: string; maxH: number; cellPx?: string }[] = [
  { name: "jt",          maxH: 28 },
  { name: "batanabank",  maxH: 26, cellPx: "px-s1" }, // 135:22 ratio — needs full width
  { name: "fingo",       maxH: 26 },
  { name: "dazzle",      maxH: 20 },
  { name: "kot",         maxH: 26 },
  { name: "swivel",      maxH: 22 },
];

// +10% logo size, +15% gap vs. the original 120px / 48px baseline.
const LOGO_SCALE = 1.1;

export function LogoMarquee() {
  return (
    <div className="overflow-hidden">
      <div className="flex animate-marquee gap-[24px] sm:gap-[55px]">
        {[...LOGOS, ...LOGOS].map((logo, i) => (
          <div
            key={i}
            className={`flex items-center justify-center ${logo.cellPx ?? "px-s4"} h-[96px] shrink-0 w-[160px]`}
          >
            <Image
              src={`/companies/${logo.name}.svg`}
              alt={logo.name}
              width={Math.round(120 * LOGO_SCALE)}
              height={Math.round(logo.maxH * LOGO_SCALE)}
              style={{ maxHeight: logo.maxH * LOGO_SCALE, width: "auto" }}
              className="object-contain brightness-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
