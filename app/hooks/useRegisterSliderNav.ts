"use client";

import { useEffect, useRef, RefObject } from "react";
import { useSliderNav, NavState } from "@/app/context/SliderNavContext";

// Show indicator when section covers ≥ this fraction of its max-visible area.
// Hide when it drops below HIDE_RATIO. The gap between them prevents flickering
// on short/bouncy scrolls.
const SHOW_RATIO = 0.5;
const HIDE_RATIO = 0.2;

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
  const visibleRef = useRef(false); // hysteresis: is this section currently shown?
  const stateRef = useRef<NavState>({ id, count, firstVisible, visibleCount, onPrev, onNext, onDotClick });

  useEffect(() => {
    stateRef.current = { id, count, firstVisible, visibleCount, onPrev, onNext, onDotClick };
  });

  // Re-push whenever firstVisible / visibleCount changes while section is active.
  useEffect(() => {
    if (!visibleRef.current) return;
    if (visibleCount >= count) {
      setSection(id, null);
      return;
    }
    setSection(id, {
      nav: { id, count, firstVisible, visibleCount, onPrev, onNext, onDotClick },
      ratio: ratioRef.current,
    });
  }, [id, count, firstVisible, visibleCount, onPrev, onNext, onDotClick, setSection]);

  // Scroll-listener approach: fires every frame during scroll via RAF, so
  // short/quick scrolls are handled reliably (IO fires only at threshold steps
  // and is async — it misses fast transitions).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const elementH = (el as HTMLElement).offsetHeight;
      const maxVisible = Math.min(elementH, viewportH);
      const intersectH = Math.max(0, Math.min(rect.bottom, viewportH) - Math.max(rect.top, 0));
      const ratio = maxVisible > 0 ? intersectH / maxVisible : 0;
      ratioRef.current = ratio;

      const wasVisible = visibleRef.current;
      // Hysteresis: show at SHOW_RATIO, hide at HIDE_RATIO
      const shouldShow = wasVisible ? ratio >= HIDE_RATIO : ratio >= SHOW_RATIO;

      if (!shouldShow) {
        if (wasVisible) {
          visibleRef.current = false;
          setSection(id, null);
        }
        return;
      }

      const s = stateRef.current;
      if (s.visibleCount >= s.count) {
        if (wasVisible) {
          visibleRef.current = false;
          setSection(id, null);
        }
        return;
      }

      visibleRef.current = true;
      setSection(id, {
        nav: { id: s.id, count: s.count, firstVisible: s.firstVisible, visibleCount: s.visibleCount, onPrev: s.onPrev, onNext: s.onNext, onDotClick: s.onDotClick },
        ratio,
      });
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    update(); // run once on mount

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      ratioRef.current = 0;
      visibleRef.current = false;
      setSection(id, null);
    };
  }, [id, containerRef, setSection]);
}
