"use client";

import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export interface SliderHandle {
  scrollToIndex: (i: number) => void;
}

export type SliderView = { firstVisible: number; visibleCount: number };

/** Desktop column count. The responsive ramp down to mobile is fixed per preset. */
export type SliderCols = 1 | 2 | 3 | 4;

interface SliderProps {
  children: React.ReactNode;
  /** How many cards fill the layout width at the largest breakpoint. Default: 3 */
  cols?: SliderCols;
  containerClassName?: string;
  slideClassName?: string;
  /** Gap between slides. 's1'=8px (default), 's3'=24px. Also adjusts card widths. */
  gapToken?: 's1' | 's3';
  /** Fires whenever the visible window changes (which cards are on screen). */
  onViewChange?: (view: SliderView) => void;
}

/*
  Card width per breakpoint. At the largest breakpoint the cards fill an equal
  fraction of the content width (N cards + (N-1) gaps === 100%, flush). Below
  that — where the cards overflow — we subtract a peek (--slider-peek = 48px) so
  a sliver of the next card stays visible, signalling there's more to scroll.

  Full literal strings so Tailwind can statically detect every class.
*/
const COL_CLASSES_S1: Record<SliderCols, string> = {
  1: "w-full",
  2: "w-[calc(100%_-_48px)] sm:w-[calc((100%_-_1*var(--spacing-s1))/2)]",
  3: "w-[calc(100%_-_48px)] sm:w-[calc((100%_-_1*var(--spacing-s1)_-_48px)/2)] lg:w-[calc((100%_-_2*var(--spacing-s1))/3)]",
  4: "w-[calc(100%_-_48px)] sm:w-[calc((100%_-_1*var(--spacing-s1)_-_48px)/2)] md:w-[calc((100%_-_2*var(--spacing-s1)_-_48px)/3)] lg:w-[calc((100%_-_3*var(--spacing-s1))/4)]",
};

const COL_CLASSES_S3: Record<SliderCols, string> = {
  1: "w-[calc(100%_+_var(--gutter))]",
  2: "w-[calc(100%_-_48px)] sm:w-[calc((100%_-_1*var(--spacing-s3))/2)]",
  3: "w-[calc(100%_-_48px)] sm:w-[316px] lg:w-[calc((100%_-_2*var(--spacing-s3))/3)]",
  4: "w-[calc(100%_-_48px)] sm:w-[calc((100%_-_1*var(--spacing-s3)_-_48px)/2)] md:w-[calc((100%_-_2*var(--spacing-s3)_-_48px)/3)] lg:w-[calc((100%_-_3*var(--spacing-s3))/4)]",
};

export const Slider = forwardRef<SliderHandle, SliderProps>(function Slider(
  { children, cols = 3, containerClassName = "", slideClassName = "", gapToken = "s1", onViewChange },
  ref,
) {
  const COL_CLASSES = gapToken === "s3" ? COL_CLASSES_S3 : COL_CLASSES_S1;
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewCbRef = useRef(onViewChange);
  useEffect(() => { viewCbRef.current = onViewChange; });

  const dragRef = useRef({ active: false, committed: false, startX: 0, startY: 0, startScroll: 0 });

  const stopDrag = useCallback(() => {
    if (!dragRef.current.active) return;
    const wasCommitted = dragRef.current.committed;
    dragRef.current = { active: false, committed: false, startX: 0, startY: 0, startScroll: 0 };
    const scroll = scrollRef.current;
    if (!scroll) return;
    scroll.style.scrollSnapType = "";
    if (!wasCommitted) return;
    const slides = Array.from(scroll.children).slice(0, -1) as HTMLElement[];
    const center = scroll.scrollLeft + scroll.clientWidth / 2;
    let nearest = 0, minDist = Infinity;
    slides.forEach((s, i) => {
      const dist = Math.abs(s.offsetLeft + s.offsetWidth / 2 - center);
      if (dist < minDist) { minDist = dist; nearest = i; }
    });
    // scrollIntoView honours scroll-padding-inline-start (the snap rest); scrolling
    // to offsetLeft would ignore it and overshoot the rest by the inset.
    slides[nearest]?.scrollIntoView({ inline: "start", block: "nearest", behavior: "smooth" });
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    dragRef.current = { active: true, committed: false, startX: e.clientX, startY: e.clientY, startScroll: scroll.scrollLeft };
    scroll.style.scrollSnapType = "none";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current.active) return;
    const dx = dragRef.current.startX - e.clientX;
    const dy = dragRef.current.startY - e.clientY;
    if (!dragRef.current.committed) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
      if (Math.abs(dy) > Math.abs(dx)) { stopDrag(); return; }
      dragRef.current.committed = true;
    }
    e.preventDefault();
    const scroll = scrollRef.current;
    if (!scroll) return;
    scroll.scrollLeft = dragRef.current.startScroll + dx;
  }, [stopDrag]);

  const count = Children.count(children);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll || count === 0) return;

    const slides = Array.from(scroll.children).slice(0, -1) as HTMLElement[];
    const visible = new Set<number>();
    let lastKey = "";

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const idx = slides.indexOf(e.target as HTMLElement);
          if (idx === -1) return;
          if (e.isIntersecting) visible.add(idx);
          else visible.delete(idx);
        });

        if (visible.size === 0) return;
        const firstVisible = Math.min(...visible);
        const visibleCount = visible.size;
        const key = `${firstVisible}:${visibleCount}`;
        if (key === lastKey) return;
        lastKey = key;
        viewCbRef.current?.({ firstVisible, visibleCount });
      },
      { root: scroll, threshold: 0.6 },
    );

    slides.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [count]);

  const scrollToIndex = useCallback((i: number) => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const slide = scroll.children[i] as HTMLElement;
    // scrollIntoView honours scroll-padding-inline-start (the snap rest); scrolling
    // to offsetLeft would ignore it and overshoot the rest by the inset.
    slide?.scrollIntoView({ inline: "start", block: "nearest", behavior: "smooth" });
  }, []);

  useImperativeHandle(ref, () => ({ scrollToIndex }), [scrollToIndex]);

  return (
    <div
      ref={scrollRef}
      style={{ touchAction: "pan-y pan-x" }}
      className={`relative flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-contain [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none max-sm:gap-s3 gap-${gapToken} ${containerClassName}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {Children.map(children, (child) => (
        <div className={`shrink-0 snap-start ${COL_CLASSES[cols]} ${slideClassName}`}>
          {child}
        </div>
      ))}
      {/* Trailing spacer: the last card needs peek-width (48px) of extra scroll range
          so it can reach its snap point when scrolled fully to the end. */}
      <div className="shrink-0 w-[48px]" aria-hidden />
    </div>
  );
});
