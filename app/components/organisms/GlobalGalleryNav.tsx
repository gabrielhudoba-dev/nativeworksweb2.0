"use client";

import { GalleryNav } from "@/app/components/molecules";
import { useSliderNav } from "@/app/context/SliderNavContext";
import { useNavOpen } from "./NavigationProvider";

export function GlobalGalleryNav() {
  const { nav } = useSliderNav();
  const navOpen = useNavOpen();
  const visible = nav !== null && !navOpen;

  return (
    <div className="fixed bottom-[82px] sm:bottom-auto sm:top-[82px] left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-auto ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 sm:-translate-y-2 pointer-events-none"
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
