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
      className={`bg-pill rounded-pill px-24 py-12 inline-flex items-center gap-8 min-w-[180px] ${className}`.trim()}
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
            className={`h-8 px-8 rounded-pill transition-all duration-300 ease-out cursor-pointer ${
              isActive ? "bg-prim flex-1" : "bg-dot-inactive hover:bg-prim/40"
            }`}
          />
        );
      })}
    </div>
  );
}
