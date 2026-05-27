"use client";

import { useState } from "react";

type Props = {
  count?: number;
  initialIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
};

export function NavigationDots({
  count = 5,
  initialIndex = 0,
  onChange,
  className = "",
}: Props) {
  const [active, setActive] = useState(initialIndex);
  const handle = (i: number) => {
    setActive(i);
    onChange?.(i);
  };
  return (
    <div
      role="tablist"
      aria-label="Page navigation"
      className={`bg-white/20 rounded-pill px-s6 py-s5 inline-flex items-center gap-s4 min-w-[180px] ${className}`.trim()}
    >
      {Array.from({ length: count }).map((_, i) => {
        const isActive = active === i;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => handle(i)}
            className={`h-s4 px-s4 rounded-pill transition-all duration-300 ease-out cursor-pointer ${
              isActive ? "bg-prim flex-1" : "bg-prim/10 hover:bg-prim/40"
            }`}
          />
        );
      })}
    </div>
  );
}
