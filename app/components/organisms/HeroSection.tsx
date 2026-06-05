"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Heading, Text } from "@/app/components/atoms";
import { GalleryNav, Refer } from "@/app/components/molecules";
import { useNavOpen } from "./NavigationProvider";
import { useSquircle } from "@/app/hooks/useSquircle";
import type { SiteContent } from "@/lib/content";

const SLIDES = 4;
const GALLERY_IMAGES = [
  { src: "/images/sline01.png", alt: "Native Works – projekt 1" },
  { src: "/images/sline02.png", alt: "Native Works – projekt 2" },
  { src: "/images/sline01.png", alt: "Native Works – projekt 3" },
  { src: "/images/sline02.png", alt: "Native Works – projekt 4" },
];
const AUTOPLAY_INTERVAL = 7000;

type Props = { content: SiteContent };

export function HeroSection({ content }: Props) {
  const [slide, setSlide] = useState(0);
  const [controlVisible, setControlVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
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


  const controlCls = controlVisible && !navOpen
    ? "opacity-100 translate-y-0 pointer-events-auto"
    : "opacity-0 translate-y-2 sm:-translate-y-2 pointer-events-none";

  return (
    <section className="px-page pb-s6 sm:pb-s12 max-w-page mx-auto">
      {/* Gallery slide controls */}
      <div className="fixed bottom-[82px] sm:bottom-auto sm:top-[82px] left-0 right-0 z-50 flex justify-center">
        <div className={`transition-all duration-300 ease-system ${controlCls}`}>
          <GalleryNav
            count={SLIDES}
            active={slide}
            onPrev={() => setSlide((s) => (s - 1 + SLIDES) % SLIDES)}
            onNext={() => setSlide((s) => (s + 1) % SLIDES)}
            onDotClick={setSlide}
          />
        </div>
      </div>

      {/* Headline */}
      <div
        className="hero-in pt-s6 sm:pt-s15 lg:pt-s18 mt-s3 sm:mt-s4 lg:mt-s6 flex flex-col items-start sm:items-center gap-s4 sm:gap-s6 text-left sm:text-center"
      >
        <Heading variant="h2" className="max-w-[672px]">
          {content.hero_title ?? "New era of digital product design."}
        </Heading>
        <div className="max-w-[544px]">
          <Text variant="p2" className={`text-prim ${!expanded ? "line-clamp-4 sm:line-clamp-none" : ""}`}>
            {content.hero_desc ?? "A curated group of product specialists working on your mobile app or web system."}
          </Text>
          {!expanded && (
            <button
              className="sm:hidden mt-s1 text-p2 font-body font-medium text-prim/40"
              onClick={() => setExpanded(true)}
            >
              Read more
            </button>
          )}
        </div>
      </div>

      {/* Tagline + refer */}
      <div
        className="hero-in flex flex-col sm:flex-row items-start sm:items-end justify-between pt-s6 sm:pt-s18 pb-s6 gap-s4 sm:gap-0"
        style={{ "--hero-delay": "0.2s" } as React.CSSProperties}
      >
        <Text variant="p1" className="max-w-[336px] text-prim text-left">
          {content.hero_tagline ?? "Product creation is changing. Shorter cycles. Faster Outcome."}
        </Text>
        <Refer
          name={content.hero_refer_name ?? "Martin Mroc"}
          role={content.hero_refer_role ?? "CDO, Vibe Studio"}
          avatar={content.hero_refer_avatar ?? "/images/martin.png"}
          className="hidden sm:flex sm:pr-s1"
        />
      </div>

      {/* Gallery */}
      <div className="hero-in" style={{ "--hero-delay": "0.35s" } as React.CSSProperties}>
        <div ref={gallerySquircleRef} style={gallerySquircleStyle} className="w-full aspect-[9/16] sm:aspect-auto sm:h-[480px] lg:h-[648px]">
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
                className="absolute inset-0 transition-opacity duration-500 ease-system"
                style={{ opacity: i === slide ? 1 : 0 }}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" priority={i === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Refer — mobile only */}
      <div className="sm:hidden pt-s3">
        <Refer
          name={content.hero_refer_name ?? "Martin Mroc"}
          role={content.hero_refer_role ?? "CDO, Vibe Studio"}
          avatar={content.hero_refer_avatar ?? "/images/martin.png"}
        />
      </div>
    </section>
  );
}
