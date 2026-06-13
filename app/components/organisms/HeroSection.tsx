"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Heading, Text } from "@/app/components/atoms";
import { Refer } from "@/app/components/molecules";
import { useNavOpen } from "./NavigationProvider";
import { useSquircle } from "@/app/hooks/useSquircle";
import { useRegisterSliderNav } from "@/app/hooks/useRegisterSliderNav";
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
  const [paused, setPaused] = useState(false);
  const navOpen = useNavOpen();
  const galleryRef = useRef<HTMLDivElement>(null);
  const { ref: gallerySquircleRef, style: gallerySquircleStyle } = useSquircle(21, 0.6);

  const onPrev = useCallback(() => setSlide((s) => (s - 1 + SLIDES) % SLIDES), []);
  const onNext = useCallback(() => setSlide((s) => (s + 1) % SLIDES), []);

  const dragStartX = useRef<number | null>(null);
  const onGalleryMouseDown = useCallback((e: React.MouseEvent) => { dragStartX.current = e.clientX; }, []);
  const onGalleryMouseUp = useCallback((e: React.MouseEvent) => {
    if (dragStartX.current === null) return;
    const delta = dragStartX.current - e.clientX;
    dragStartX.current = null;
    if (Math.abs(delta) < 30) return;
    if (delta > 0) onNext(); else onPrev();
  }, [onNext, onPrev]);
  const onDotClick = useCallback((i: number) => setSlide(i), []);

  useRegisterSliderNav({
    id: "hero-gallery",
    count: SLIDES,
    firstVisible: slide,
    visibleCount: 1,
    onPrev,
    onNext,
    onDotClick,
    containerRef: galleryRef,
  });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduced) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES), AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  // Author per gallery slide — the Refer reflects whoever is behind the visible image.
  const galleryAuthors = [
    { name: content.hero_refer_name ?? "Gabriel Hudoba", role: content.hero_refer_role ?? "Brand, Design", avatar: content.hero_refer_avatar ?? "/images/gabo.png" },
    { name: content.hero_refer2_name ?? "Milan Tibensky", role: content.hero_refer2_role ?? "Data, Growth", avatar: content.hero_refer2_avatar ?? "/images/milan.png" },
    { name: content.hero_refer3_name ?? "Maria Susteka", role: content.hero_refer3_role ?? "Design", avatar: content.hero_refer3_avatar },
    { name: content.hero_refer4_name ?? "Martin Mroc", role: content.hero_refer4_role ?? "Design", avatar: content.hero_refer4_avatar ?? "/images/martin.png" },
  ];
  const refer = galleryAuthors[slide] ?? galleryAuthors[0];

  return (
    <section className="px-page max-w-page mx-auto max-sm:pb-s6 sm:pb-0" style={{ paddingTop: "var(--hero-section-pt)" }}>
      <div className="hero-in pt-0 max-sm:pt-s12 sm:pt-s15 lg:pt-s18 sm:mt-s3 lg:mt-s6 flex flex-col items-start sm:items-center gap-s6 text-left sm:text-center">
        {/* max-width in em (not px) so it scales with the responsive h1 font
            (96/72/48px) — keeps the same 3-line composition at every breakpoint
            without hard line breaks. 8em ≈ the old 760px at 96px. */}
        <Heading variant="h1" className="max-w-[8em]">
          {(content.hero_title ?? "Better digital products through human decisions.").replace(/\n/g, " ")}
        </Heading>
        <div className="max-w-[608px] pb-[72px]">
          <Text variant="p1" className="text-prim max-sm:text-p2">
            {content.hero_desc ?? "A curated group of product specialists working on your system. Inside your team. Solving product problems from early concepts to product friction. With a level of speed previously impossible. Delivered through to production-ready output."}
          </Text>
        </div>
      </div>

      <div
        className="hero-in flex flex-col sm:flex-row items-start sm:items-end justify-between sm:pt-s18 pb-[24px] gap-s3 sm:gap-0"
        style={{ "--hero-delay": "0.2s" } as React.CSSProperties}
      >
        <Text variant="p1" className="max-w-[320px] text-prim text-left">
          {content.hero_tagline ?? "Product creation is changing. Shorter cycles. Faster Outcome."}
        </Text>
        {/* Fixed width = widest author block ("Gabriel Hudoba", 48 avatar + 16 gap
            + 111 text) + 8px reserve so no name wraps, + 8px pr-s1 → the avatar
            stays put as the author rotates. */}
        <Refer
          name={refer.name}
          role={refer.role}
          avatar={refer.avatar}
          className="hidden sm:flex sm:pr-s1 sm:w-[192px]"
        />
      </div>

      <div className="hero-in" style={{ "--hero-delay": "0.35s" } as React.CSSProperties}>
        <div ref={gallerySquircleRef} style={gallerySquircleStyle} className="w-full h-[576px] sm:h-[480px] lg:h-[648px]">
          <div
            ref={galleryRef}
            className="w-full h-full overflow-hidden bg-surface relative cursor-grab active:cursor-grabbing select-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => { setPaused(false); dragStartX.current = null; }}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onMouseDown={onGalleryMouseDown}
            onMouseUp={onGalleryMouseUp}
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

      <div className="sm:hidden pt-s3">
        <Refer name={refer.name} role={refer.role} avatar={refer.avatar} />
      </div>
    </section>
  );
}
