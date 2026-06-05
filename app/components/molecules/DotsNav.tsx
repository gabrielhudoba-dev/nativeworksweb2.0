"use client";

import { GlassCard } from "@developer-hub/liquid-glass";

type Props = {
  count: number;
  /** Indices of currently visible cards */
  activeSet: Set<number>;
  onDotClick?: (index: number) => void;
};

export function DotsNav({ count, activeSet, onDotClick }: Props) {
  return (
    <GlassCard cornerRadius={9999} padding="0px" blurAmount={0} displacementScale={80}>
      <div className="flex items-center justify-center px-s3 h-s7 bg-[#D9D9D9]/20 rounded-pill">
        <div className="flex items-center justify-center gap-s1 h-s1">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => onDotClick?.(i)}
              className={`size-s1 rounded-full shrink-0 transition-[background-color] duration-300 cursor-pointer ${
                activeSet.has(i) ? "bg-prim" : "bg-prim/20"
              }`}
            />
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
