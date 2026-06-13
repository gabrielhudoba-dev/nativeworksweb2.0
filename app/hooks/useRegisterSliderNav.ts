"use client";

import { useEffect, useRef, RefObject } from "react";
import { useSliderNav, NavState } from "@/app/context/SliderNavContext";

type Options = Omit<NavState, "id"> & {
  id: string;
  containerRef: RefObject<Element | null>;
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
}: Options) {
  const { setSection } = useSliderNav();
  const ratioRef = useRef(0);
  const stateRef = useRef<NavState>({ id, count, firstVisible, visibleCount, onPrev, onNext, onDotClick });

  useEffect(() => {
    stateRef.current = { id, count, firstVisible, visibleCount, onPrev, onNext, onDotClick };
  });

  // Push updated nav state whenever the visible window changes while section is in view.
  useEffect(() => {
    if (ratioRef.current <= 0) return;
    if (visibleCount >= count) {
      setSection(id, null);
      return;
    }
    setSection(id, {
      nav: { id, count, firstVisible, visibleCount, onPrev, onNext, onDotClick },
      ratio: ratioRef.current,
    });
  }, [id, count, firstVisible, visibleCount, onPrev, onNext, onDotClick, setSection]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const thresholds = Array.from({ length: 11 }, (_, i) => i / 10);

    const io = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        ratioRef.current = ratio;

        if (ratio < 0.5) {
          setSection(id, null);
          return;
        }

        const s = stateRef.current;
        if (s.visibleCount >= s.count) {
          setSection(id, null);
          return;
        }

        setSection(id, {
          nav: {
            id: s.id,
            count: s.count,
            firstVisible: s.firstVisible,
            visibleCount: s.visibleCount,
            onPrev: s.onPrev,
            onNext: s.onNext,
            onDotClick: s.onDotClick,
          },
          ratio,
        });
      },
      { threshold: thresholds },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      ratioRef.current = 0;
      setSection(id, null);
    };
  }, [id, containerRef, setSection]);
}
