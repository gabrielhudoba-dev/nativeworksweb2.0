"use client";

import Image from "next/image";

// alternated: icon, wordmark, icon, wordmark...
// maxH calibrated per-logo for equal optical weight
const LOGOS: { name: string; maxH: number }[] = [
  { name: "jt",          maxH: 28 }, // icon  40×55
  { name: "batanabank",  maxH: 20 }, // wordmark — text fills ~100% viewBox height
  { name: "fingo",       maxH: 26 }, // icon  53×45
  { name: "dazzle",      maxH: 20 }, // wordmark — text fills ~87% viewBox height
  { name: "kot",         maxH: 26 }, // icon  51×45
  { name: "reapp",       maxH: 25 }, // wordmark — text fills only ~55% (icon takes top 45%)
  { name: "swivel",      maxH: 22 }, // wordmark — text fills ~78% viewBox height
];

// +10% logo size, +15% gap vs. the original 120px / 48px baseline.
const LOGO_SCALE = 1.1;

export function LogoMarquee() {
  return (
    <div className="overflow-hidden">
      <div className="flex animate-marquee" style={{ gap: "55px" }}>
        {[...LOGOS, ...LOGOS].map((logo, i) => (
          <div
            key={i}
            className="flex items-center justify-center px-s4 h-[88px] shrink-0 w-[160px]"
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
