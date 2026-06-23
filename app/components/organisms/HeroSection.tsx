"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heading, Text } from "@/app/components/atoms";
import { Refer, Slider } from "@/app/components/molecules";
import type { SliderView } from "@/app/components/molecules/Slider";
import { useSliderSection } from "@/app/hooks/useSliderSection";
import type { SiteContent } from "@/lib/content";

const GALLERY_ITEMS = [
  { src: "/images/slider/slider05.mp4?v=2", alt: "Payrly – 5", type: "video" },
  { src: "/images/slider/slider01.png", alt: "Payrly – 1", type: "image" },
  { src: "/images/slider/slider02new.png", alt: "Payrly – 2", type: "image" },
  { src: "/images/slider/slider03.png", alt: "Payrly – 3", type: "image" },
  { src: "/images/slider/slider04new.mp4", alt: "Payrly – 4", type: "video" },
  { src: "/images/slider/steward.png", alt: "Steward Oaks", type: "image" },
];

// Active card = layout content width (1440 − 2·gutter at the cap, responsive below).
const SLIDE_CLASS =
  "!w-[calc(min(100vw,_1440px)_-_2_*_var(--gutter))] rounded-[21px] overflow-hidden h-[576px] sm:h-[480px] lg:h-[648px] relative";

// Inset = distance from viewport edge to the layout content edge: the outer
// margin ((100vw − page)/2) plus the gutter. Applied as real padding (so the
// first card sits in the content area) and scroll-padding (so every snap lands
// there). Must be a static literal — Tailwind only detects classes in raw text.
const GALLERY_CONTAINER_CLASS =
  "px-[calc((100vw_-_min(100vw,_1440px))_/_2_+_var(--gutter))] [scroll-padding-inline-start:calc((100vw_-_min(100vw,_1440px))_/_2_+_var(--gutter))]";

type Props = { content: SiteContent };

export function HeroSection({ content }: Props) {
  const { sliderRef, containerRef, onViewChange: registerViewChange } =
    useSliderSection("hero-gallery", GALLERY_ITEMS.length, 1);
  const [firstVisible, setFirstVisible] = useState(0);

  const onViewChange = useCallback(
    (view: SliderView) => {
      setFirstVisible(view.firstVisible);
      registerViewChange(view);
    },
    [registerViewChange],
  );

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const video = videoRefs.current[firstVisible];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, [firstVisible]);

  const galleryAuthors = [
    { name: "Gabriel Hudoba", role: "Payrly",        avatar: "/images/gabo.png" },
    { name: "Gabriel Hudoba", role: "Payrly",        avatar: "/images/gabo.png" },
    { name: "Gabriel Hudoba", role: "Payrly",        avatar: "/images/gabo.png" },
    { name: "Gabriel Hudoba", role: "Payrly",        avatar: "/images/gabo.png" },
    { name: "Gabriel Hudoba", role: "Payrly",        avatar: "/images/gabo.png" },
    { name: "Gabriel Hudoba", role: "Steward Oaks",  avatar: "/images/gabo.png" },
  ];
  const refer = galleryAuthors[firstVisible] ?? galleryAuthors[0];

  return (
    <section style={{ paddingTop: "var(--hero-section-pt)" }}>
      {/* text block — constrained to page width */}
      <div className="px-page max-w-page mx-auto max-sm:pb-s6 sm:pb-0">
        <div className="hero-in pt-0 max-sm:pt-s12 sm:pt-s15 lg:pt-s18 sm:mt-s9 lg:mt-s12 flex flex-col items-start sm:items-center gap-s6 text-left sm:text-center">
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
          <Refer
            name={refer.name}
            role={refer.role}
            avatar={refer.avatar}
            className="hidden sm:flex sm:pr-s1 sm:w-[192px]"
          />
        </div>
      </div>

      {/* gallery — full-bleed scroll container; the card itself is layout-width,
          so the active card lands in the content area and neighbours peek to the
          viewport edges. No max-w-page (it would clip the peek) and no overflow-hidden. */}
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="hero-in"
        style={{ "--hero-delay": "0.35s" } as React.CSSProperties}
      >
        <Slider
          ref={sliderRef}
          cols={1}
          gapToken="s3"
          onViewChange={onViewChange}
          containerClassName={GALLERY_CONTAINER_CLASS}
          slideClassName={SLIDE_CLASS}
        >
          {GALLERY_ITEMS.map((item, i) => (
            <div key={i} className="relative w-full h-full">
              {item.type === "video" ? (
                <video
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={item.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover block"
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="100vw"
                />
              )}
              {i === 2 && (
                <img
                  src="/images/slider/payrlylogoshort.svg"
                  alt="Payrly"
                  className="absolute inset-0 m-auto h-s10 w-auto z-10"
                />
              )}
              {(i === 1 || i === 3) && (
                <img
                  src="/images/slider/payrlylogo.svg"
                  alt="Payrly"
                  className={`absolute bottom-s5 left-s5 h-s8 z-10 ${i === 3 ? "invert" : ""}`}
                />
              )}
            </div>
          ))}
        </Slider>
      </div>

      <div className="px-page max-w-page mx-auto sm:hidden pt-s3">
        <Refer name={refer.name} role={refer.role} avatar={refer.avatar} />
      </div>
    </section>
  );
}
