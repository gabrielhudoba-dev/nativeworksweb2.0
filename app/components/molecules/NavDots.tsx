"use client";

import { useSliderNav } from "@/app/context/SliderNavContext";

type Props = { menuOpen: boolean };

export function NavDots({ menuOpen }: Props) {
  const { nav } = useSliderNav();

  return null;
  if (!nav || menuOpen) return null;
  const { count, firstVisible, visibleCount, onDotClick, id } = nav;
  if (visibleCount >= count) return null;

  const isPill = id === "hero-gallery";

  return (
    <div className="flex items-center justify-center gap-s1 h-s1">
      {Array.from({ length: count }).map((_, i) => {
        const active = i >= firstVisible && i < firstVisible + visibleCount;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => onDotClick(i)}
            className={`h-s1 rounded-pill shrink-0 transition-[width,background-color] duration-300 ease-system ${
              active
                ? isPill ? "w-s6 bg-prim" : "w-s1 bg-prim"
                : "w-s1 bg-prim/20"
            }`}
          />
        );
      })}
    </div>
  );
}
