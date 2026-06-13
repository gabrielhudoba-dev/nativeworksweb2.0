"use client";

import { useEffect, useRef, useState } from "react";
import { GalleryNav } from "@/app/components/molecules";
import { useSliderNav } from "@/app/context/SliderNavContext";
import { useNavOpen } from "./NavigationProvider";

export function GlobalGalleryNav() {
  const { nav } = useSliderNav();
  const navOpen = useNavOpen();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = nav !== null && !navOpen && scrolled;

  // Global click → prev/next based on which screen half was clicked.
  // Skips interactive elements so links, buttons, and inputs still work normally.
  const navRef = useRef(nav);
  navRef.current = nav;
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!navRef.current) return;
      const target = e.target as Element;
      if (target.closest("a, button, input, select, textarea, [role='button'], [tabindex]")) return;
      if (e.clientX < window.innerWidth / 2) navRef.current.onPrev();
      else navRef.current.onNext();
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="fixed left-0 right-0 z-40 flex justify-center pointer-events-none" style={{ top: "var(--gallery-nav-top, 82px)" }}>
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-auto ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {nav && (
          <GalleryNav
            count={nav.count}
            firstVisible={nav.firstVisible}
            visibleCount={nav.visibleCount}
            onPrev={nav.onPrev}
            onNext={nav.onNext}
            onDotClick={nav.onDotClick}
            variant={nav.id === "hero-gallery" ? "pill" : "dots"}
          />
        )}
      </div>
    </div>
  );
}
