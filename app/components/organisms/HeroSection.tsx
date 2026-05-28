"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Heading, Text } from "@/app/components/atoms";
import { GalleryNav, Refer } from "@/app/components/molecules";
import { useNavOpen } from "./NavigationProvider";
import { useSquircle } from "@/app/hooks/useSquircle";

const SLIDES = 4;
const GALLERY_IMAGES = [
  { src: "/images/sline01.png", alt: "Native Works – projekt 1" },
  { src: "/images/sline02.png", alt: "Native Works – projekt 2" },
  { src: "/images/sline01.png", alt: "Native Works – projekt 3" },
  { src: "/images/sline02.png", alt: "Native Works – projekt 4" },
];
const AUTOPLAY_INTERVAL = 7000;

export function HeroSection() {
  const [slide, setSlide] = useState(0);
  const [controlVisible, setControlVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const navOpen = useNavOpen();
  const galleryRef = useRef<HTMLDivElement>(null);
  const { ref: gallerySquircleRef, style: gallerySquircleStyle } = useSquircle(21, 0.6);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const ratio = entries[0].intersectionRatio;
        if (ratio >= 0.8) setControlVisible(true);
        else if (ratio < 0.6) setControlVisible(false);
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduced) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES), AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="px-s11 pb-s12 max-w-page mx-auto">
      {/* Gallery slide controls — fixed below the nav pill */}
      <div className="fixed top-[82px] left-0 right-0 z-50 flex justify-center">
        <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${controlVisible && !navOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
          <GalleryNav
            count={SLIDES}
            active={slide}
            onPrev={() => setSlide(s => (s - 1 + SLIDES) % SLIDES)}
            onNext={() => setSlide(s => (s + 1) % SLIDES)}
            onDotClick={setSlide}
          />
        </div>
      </div>

      {/* Headline — flows on the 24px baseline grid (no vh, no vertical
          centering; both break the rhythm). Spacing is all multiples of 24. */}
      <div className="pt-s18 mt-s6 flex flex-col items-center gap-s6 text-center">
        <Heading variant="h2" className="max-w-[672px]">
          New era of digital product design.
        </Heading>
        <Text variant="p2" className="max-w-[544px] text-prim">
          A curated group of product specialists working on your mobile app or
          web system. Inside your team. Solving product problems from early
          concepts to product friction. With a level of speed previously
          impossible. Delivered through to production-ready output.
        </Text>
      </div>
      <div className="flex items-end justify-between pt-s18 pb-s6">
        <Text variant="p1" className="max-w-[336px] text-prim text-left">
          Product creation is changing. Shorter cycles. Faster Outcome.
        </Text>
        <Refer name="Martin Mroc" role="CDO, Vibe Studio" avatar="/images/martin.png" className="pr-s1" />
      </div>

      {/* Gallery — 640px */}
      <div ref={gallerySquircleRef} style={{ ...gallerySquircleStyle, height: "648px" }} className="w-full">
      <div
        ref={galleryRef}
        className="w-full h-full overflow-hidden bg-surface relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        aria-roledescription="carousel"
        aria-label="Ukážky projektov"
      >
        {GALLERY_IMAGES.map((img, i) => (
          <div
            key={i}
            aria-roledescription="slide"
            aria-label={`${i + 1} z ${SLIDES}`}
            aria-hidden={i !== slide}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === slide ? 1 : 0 }}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" priority={i === 0} />
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
