"use client";

import { GlassCard } from "@developer-hub/liquid-glass";
import { IconButton } from "@/app/components/atoms/IconButton";

type Props = {
  count: number;
  firstVisible: number;
  visibleCount: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
  /** "dots" = all indicators are circles; "pill" = active indicator is a wider bar. Default: "dots" */
  variant?: "dots" | "pill";
};

export function GalleryNav({ count, firstVisible, visibleCount, onPrev, onNext, onDotClick, variant = "dots" }: Props) {
  return (
    <GlassCard cornerRadius={9999} padding="0px" blurAmount={0} displacementScale={80}>
      <div className="flex items-center justify-between px-s3 h-s7 w-pill bg-[#D9D9D9]/20">
        <IconButton icon="chevron-left" label="Predchádzajúci" onClick={onPrev} />
        <div className="flex items-center justify-center gap-s1 flex-1 mx-s1 h-s1">
          {Array.from({ length: count }).map((_, i) => {
            const active = i >= firstVisible && i < firstVisible + visibleCount;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => onDotClick(i)}
                className={`h-s1 rounded-pill shrink-0 transition-[width,background-color] duration-300 ease-system cursor-pointer ${
                  active
                    ? (variant === "pill" ? "w-s11 bg-prim" : "w-s1 bg-prim")
                    : "w-s1 bg-prim/20"
                }`}
              />
            );
          })}
        </div>
        <IconButton icon="chevron-right" label="Nasledujúci" onClick={onNext} />
      </div>
    </GlassCard>
  );
}
