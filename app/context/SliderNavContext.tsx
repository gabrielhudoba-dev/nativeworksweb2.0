"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

export type NavState = {
  id: string;
  count: number;
  /** Index of the first visible card */
  firstVisible: number;
  /** How many cards are visible at once */
  visibleCount: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (i: number) => void;
};

type SectionEntry = { nav: NavState; ratio: number };

type Ctx = {
  nav: NavState | null;
  setSection: (id: string, entry: SectionEntry | null) => void;
};

const SliderNavContext = createContext<Ctx>({ nav: null, setSection: () => {} });

export function SliderNavProvider({ children }: { children: React.ReactNode }) {
  const sectionsRef = useRef<Map<string, SectionEntry>>(new Map());
  const [nav, setNav] = useState<NavState | null>(null);

  const recompute = useCallback(() => {
    let best: SectionEntry | null = null;
    for (const entry of sectionsRef.current.values()) {
      if (!best || entry.ratio > best.ratio) best = entry;
    }
    const newNav = best?.nav ?? null;
    setNav((prev) => {
      if (
        prev?.id === newNav?.id &&
        prev?.firstVisible === newNav?.firstVisible &&
        prev?.visibleCount === newNav?.visibleCount
      ) {
        return prev;
      }
      return newNav;
    });
  }, []);

  const setSection = useCallback(
    (id: string, entry: SectionEntry | null) => {
      if (entry === null) {
        sectionsRef.current.delete(id);
      } else {
        sectionsRef.current.set(id, entry);
      }
      recompute();
    },
    [recompute],
  );

  return (
    <SliderNavContext.Provider value={{ nav, setSection }}>
      {children}
    </SliderNavContext.Provider>
  );
}

export function useSliderNav() {
  return useContext(SliderNavContext);
}
