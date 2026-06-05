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
      <div className="flex items-center justify-between px-s3 h-s7 w-pill bg-[#D9D9D9]/20">
        <IconButton icon="chevron-left" label="Predchádzajúci" onClick={onPrev} />
        <div className="flex items-center justify-center gap-s1 flex-1 mx-s1 h-s1">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => onDotClick(i)}
              className={`h-s1 rounded-pill transition-[width,background-color] duration-300 ease-system cursor-pointer shrink-0 ${
                active === i ? "bg-prim w-s11" : "bg-prim/20 w-s1"
              }`}
            />
          ))}
        </div>
        <IconButton icon="chevron-right" label="Nasledujúci" onClick={onNext} />
      </div>
    </GlassCard>
  );
}
