"use client";

import type { CSSProperties } from "react";
import { GlassCard } from "@developer-hub/liquid-glass";
import { Text, Heading } from "@/app/components/atoms";
import { Button } from "./Button";

// Denser variant of the stats-section dot pattern. Rendered as its own inset
// layer (see below) so the dots start/end with the card's padding instead of
// bleeding to the edge, and don't clip the surface fill.
const INACTIVE_DOT_BG: CSSProperties = {
  backgroundImage: "radial-gradient(circle, rgba(9,14,58,0.08) 1.5px, transparent 1.5px)",
  backgroundSize: "16px 16px",
};

type Props = {
  title: string;
  desc: string;
  price: string;
  duration: string;
  active: boolean;
  onClick: () => void;
  onLetStart: (e: React.MouseEvent) => void;
  features?: string[];
};

export function ServiceCard({ title, desc, price, duration, active, onClick, onLetStart, features }: Props) {
  return (
    <div className="flex flex-col h-full cursor-pointer" onClick={onClick}>
      <div className="grain bg-surface rounded-[12px] flex flex-col justify-between min-h-[370px] pt-s6 pb-s4 px-s2">
        {!active && (
          <div
            aria-hidden="true"
            style={INACTIVE_DOT_BG}
            className="pointer-events-none absolute inset-s2 -z-10"
          />
        )}
        <div className="px-[8px]">
          <Heading variant="h4" className="text-[24px] leading-[24px]">
            {title.split(' ').slice(0, -1).join(' ')}<br />{title.split(' ').at(-1)}™
          </Heading>
        </div>
        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between px-[8px] pb-s3">
            <Text variant="h5" as="span">{price}</Text>
            <Text variant="h5" as="span">{duration}</Text>
          </div>
          {active ? (
            <Button
              variant="dark"
              size="lg"
              rightIcon="arrow-right"
              className="w-full"
              onClick={onLetStart}
            >
              {"Let's Start"}
            </Button>
          ) : (
            // Same liquid-glass treatment as the nav pill.
            <GlassCard cornerRadius={9999} padding="0px" blurAmount={0} displacementScale={80} className="cta-glass w-full">
              <Button
                variant="secondary"
                size="lg"
                rightIcon="arrow-right"
                className="w-full bg-[#D9D9D9]/20"
                style={{ textShadow: "none" }}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
              >
                {"Let's Start"}
              </Button>
            </GlassCard>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col pl-s2 pr-s6 mt-s5 mb-s6">
        <Text variant="p2" style={{ color: "rgba(18,19,25,0.5)" }} className="mb-s5">
          {desc}
        </Text>
        {features && features.length > 0 && (
          <div className="flex flex-col">
            {features.map((f, i) => (
              <div key={i} className="border-t border-[rgba(18,19,25,0.1)] py-s3">
                <Text variant="p2">{f}</Text>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
