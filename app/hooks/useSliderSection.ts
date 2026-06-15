"use client";

import { useCallback, useRef, useState } from "react";
import type { SliderHandle, SliderView } from "@/app/components/molecules/Slider";
import { useRegisterSliderNav } from "./useRegisterSliderNav";

/**
 * Wires a slider into the global gallery-nav system.
 * Owns the visible-window state and exposes the refs + callback the Slider needs.
 *
 *   const { sliderRef, containerRef, onViewChange } = useSliderSection("services", count);
 *   <div ref={containerRef}>
 *     <Slider ref={sliderRef} cols={3} onViewChange={onViewChange}>…</Slider>
 *   </div>
 */
export function useSliderSection(id: string, count: number, initialVisibleCount?: number) {
  const sliderRef = useRef<SliderHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Default: assume all visible until the observer reports otherwise (no flash for sections
  // where every card fits). Pass initialVisibleCount to pre-register a specific count.
  const [view, setView] = useState<SliderView>({ firstVisible: 0, visibleCount: initialVisibleCount ?? count });

  const onViewChange = useCallback((v: SliderView) => setView(v), []);

  const onPrev = useCallback(
    () => sliderRef.current?.scrollToIndex(Math.max(0, view.firstVisible - 1)),
    [view.firstVisible],
  );
  const onNext = useCallback(
    () => sliderRef.current?.scrollToIndex(
      Math.min(count - view.visibleCount, view.firstVisible + 1),
    ),
    [view.firstVisible, view.visibleCount, count],
  );
  const onDotClick = useCallback(
    (i: number) => sliderRef.current?.scrollToIndex(i),
    [],
  );

  useRegisterSliderNav({
    id,
    count,
    firstVisible: view.firstVisible,
    visibleCount: view.visibleCount,
    onPrev,
    onNext,
    onDotClick,
    containerRef,
  });

  return { sliderRef, containerRef, onViewChange };
}
