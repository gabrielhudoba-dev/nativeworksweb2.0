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

type Ctx = {
  nav: NavState | null;
  setNav: (id: string, state: NavState | null) => void;
};

const SliderNavContext = createContext<Ctx>({ nav: null, setNav: () => {} });

export function SliderNavProvider({ children }: { children: React.ReactNode }) {
  const [nav, setNavState] = useState<NavState | null>(null);
  const activeId = useRef<string | null>(null);

  const setNav = useCallback((id: string, state: NavState | null) => {
    if (state === null) {
      if (activeId.current === id) {
        activeId.current = null;
        setNavState(null);
      }
    } else {
      activeId.current = id;
      setNavState({ ...state, id });
    }
  }, []);

  return (
    <SliderNavContext.Provider value={{ nav, setNav }}>
      {children}
    </SliderNavContext.Provider>
  );
}

export function useSliderNav() {
  return useContext(SliderNavContext);
}
