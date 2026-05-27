"use client";

import { GlassCard } from "@developer-hub/liquid-glass";
import { IconButton } from "@/app/components/atoms/IconButton";

type Props = {
  count: number;
  active: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
};

export function GalleryNav({ count, active, onPrev, onNext, onDotClick }: Props) {
  return (
    <GlassCard cornerRadius={9999} padding="0px" blurAmount={0} displacementScale={80}>
      <div className="flex items-center justify-between px-s6 h-s8 w-[300px] bg-[#D9D9D9]/20">
        <IconButton icon="chevron-left" label="Predchádzajúci" onClick={onPrev} />
        <div className="flex items-center justify-center gap-s4 flex-1 mx-s4 h-s4">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => onDotClick(i)}
              className={`h-s4 rounded-pill transition-[width,background-color] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer shrink-0 ${
                active === i ? "bg-prim w-s9" : "bg-prim/20 w-s4"
              }`}
            />
          ))}
        </div>
        <IconButton icon="chevron-right" label="Nasledujúci" onClick={onNext} />
      </div>
    </GlassCard>
  );
}
