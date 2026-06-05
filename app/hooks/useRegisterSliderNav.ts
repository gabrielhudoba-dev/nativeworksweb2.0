"use client";

import { useEffect, useRef, RefObject } from "react";
import { useSliderNav, NavState } from "@/app/context/SliderNavContext";

type Options = NavState & {
  id: string;
  containerRef: RefObject<Element | null>;
  showThreshold?: number;
  hideThreshold?: number;
};

export function useRegisterSliderNav({
  id,
  count,
  firstVisible,
  visibleCount,
  onPrev,
  onNext,
  onDotClick,
  containerRef,
  showThreshold = 0.3,
  hideThreshold = 0.15,
}: Options) {
  const { setNav } = useSliderNav();
  const inView = useRef(false);
  const stateRef = useRef<NavState>({ id, count, firstVisible, visibleCount, onPrev, onNext, onDotClick });

  useEffect(() => {
    stateRef.current = { id, count, firstVisible, visibleCount, onPrev, onNext, onDotClick };
  });

  // Push updated state when primitives change while section is in view.
  // The indicator only makes sense when some cards are off-screen.
  useEffect(() => {
    if (!inView.current) return;
    if (visibleCount >= count) {
      setNav(id, null);
      return;
    }
    setNav(id, { id, count, firstVisible, visibleCount, onPrev, onNext, onDotClick });
  }, [id, count, firstVisible, visibleCount, onPrev, onNext, onDotClick, setNav]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const thresholds = Array.from({ length: 11 }, (_, i) => i / 10);

    const io = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        if (!inView.current && ratio >= showThreshold) {
          inView.current = true;
          const s = stateRef.current;
          if (s.visibleCount >= s.count) {
            setNav(id, null);
            return;
          }
          setNav(id, { id: s.id, count: s.count, firstVisible: s.firstVisible, visibleCount: s.visibleCount, onPrev: s.onPrev, onNext: s.onNext, onDotClick: s.onDotClick });
        } else if (inView.current && ratio < hideThreshold) {
          inView.current = false;
          setNav(id, null);
        }
      },
      { threshold: thresholds },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      inView.current = false;
      setNav(id, null);
    };
  }, [id, containerRef, showThreshold, hideThreshold, setNav]);
}
