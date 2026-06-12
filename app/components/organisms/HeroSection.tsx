"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Heading, Text, Dispersion } from "@/app/components/atoms";
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
  const [expanded, setExpanded] = useState(false);
  const navOpen = useNavOpen();
  const galleryRef = useRef<HTMLDivElement>(null);
  const { ref: gallerySquircleRef, style: gallerySquircleStyle } = useSquircle(21, 0.6);

  const onPrev = useCallback(() => setSlide((s) => (s - 1 + SLIDES) % SLIDES), []);
  const onNext = useCallback(() => setSlide((s) => (s + 1) % SLIDES), []);
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
    { name: content.hero_refer_name ?? "Martin Mroc", role: content.hero_refer_role ?? "CDO, Vibe Studio", avatar: content.hero_refer_avatar ?? "/images/martin.png" },
    { name: content.hero_refer2_name ?? "Head of Product", role: content.hero_refer2_role ?? "Payrly (name withheld by request)", avatar: content.hero_refer2_avatar },
    { name: content.hero_refer3_name ?? "VP Product", role: content.hero_refer3_role ?? "Clarify (name withheld by request)", avatar: content.hero_refer3_avatar },
    { name: content.hero_refer4_name ?? "CEO", role: content.hero_refer4_role ?? "Volba (name withheld by request)", avatar: content.hero_refer4_avatar },
  ];
  const refer = galleryAuthors[slide] ?? galleryAuthors[0];

  return (
    <section className="px-page max-w-page mx-auto" style={{ paddingTop: "var(--hero-section-pt)" }}>
      <div className="hero-in pt-s18 sm:pt-s15 lg:pt-s18 sm:mt-s4 lg:mt-s6 flex flex-col items-start sm:items-center gap-s4 sm:gap-s6 text-left sm:text-center">
        <Heading variant="h1" className="max-w-[800px]">
          <Dispersion dynamic softBlur={0.8}>
            {(content.hero_title ?? "New era of digital\nproduct design.")
              .split("\n")
              .map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
          </Dispersion>
        </Heading>
        <div className="max-w-[544px] pb-[80px]">
          <Text
            variant="p2"
            className={`text-prim sm:!line-clamp-none cursor-pointer select-none transition-all duration-300 ${expanded ? "" : "line-clamp-3"}`}
            onClick={() => setExpanded((v) => !v)}
          >
            {content.hero_desc ?? "A curated group of product specialists working on your mobile app or web system."}
          </Text>
        </div>
      </div>

      <div
        className="hero-in flex flex-col sm:flex-row items-start sm:items-end justify-between sm:pt-s18 pb-[24px] gap-s4 sm:gap-0"
        style={{ "--hero-delay": "0.2s" } as React.CSSProperties}
      >
        <Text variant="p1" className="max-w-[336px] text-prim text-left">
          {content.hero_tagline ?? "Product creation is changing. Shorter cycles. Faster Outcome."}
        </Text>
        <Refer
          name={refer.name}
          role={refer.role}
          avatar={refer.avatar}
          className="hidden sm:flex sm:pr-s1"
        />
      </div>

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

      <div className="sm:hidden pt-s3">
        <Refer name={refer.name} role={refer.role} avatar={refer.avatar} />
      </div>
    </section>
  );
}
