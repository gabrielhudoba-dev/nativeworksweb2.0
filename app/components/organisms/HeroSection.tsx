"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heading, Text } from "@/app/components/atoms";
import { Refer, Slider } from "@/app/components/molecules";
import type { SliderView } from "@/app/components/molecules/Slider";
import { useSliderSection } from "@/app/hooks/useSliderSection";
import type { SiteContent, HeroSliderItem } from "@/lib/content";

// Active card = layout content width (1440 − 2·gutter at the cap, responsive below).
const SLIDE_CLASS =
  "!w-[calc(min(100vw,_1440px)_-_2_*_var(--gutter))] rounded-[21px] overflow-hidden h-[240px] sm:h-[480px] lg:h-[648px] relative hero-slide";

// Inset = distance from viewport edge to the layout content edge: the outer
// margin ((100vw − page)/2) plus the gutter. Applied as real padding (so the
// first card sits in the content area) and scroll-padding (so every snap lands
// there). Must be a static literal — Tailwind only detects classes in raw text.
const GALLERY_CONTAINER_CLASS =
  "px-[calc((100vw_-_min(100vw,_1440px))_/_2_+_var(--gutter))] [scroll-padding-inline-start:calc((100vw_-_min(100vw,_1440px))_/_2_+_var(--gutter))]";

type Props = { content: SiteContent; items: HeroSliderItem[] };

export function HeroSection({ content, items }: Props) {
  const { sliderRef, containerRef, onViewChange: registerViewChange } =
    useSliderSection("hero-gallery", items.length, 1);
  const [firstVisible, setFirstVisible] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);

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

  const current = items[firstVisible] ?? items[0];
  const refer = current
    ? { name: current.author_name ?? "", role: current.author_role ?? "", avatar: current.author_avatar ?? "" }
    : null;

  return (
    <section style={{ paddingTop: "var(--hero-section-pt)" }}>
      {/* text block — constrained to page width */}
      <div className="px-page max-w-page mx-auto sm:pb-0">
        <div className="hero-in pt-0 sm:pt-s12 lg:pt-s15 sm:mt-s9 lg:mt-s12 flex flex-col items-start sm:items-center gap-s6 max-sm:gap-s3 text-left sm:text-center">
          <Heading variant="h2" className="max-w-[7.5em]">
            {(content.hero_title ?? "Better digital products through human decisions.").replace(/\n/g, " ")}
          </Heading>
          <div className="max-w-[608px] max-sm:pb-s6 sm:pb-s18 lg:pb-[168px]">
            {/* tablet/desktop: full description */}
            <Text variant="p1" className="hidden sm:block text-prim">
              {content.hero_desc ?? "A curated group of product specialists working on your system. Inside your team. Solving product problems from early concepts to product friction. With a level of speed previously impossible. Delivered through to production-ready output."}
            </Text>
            {/* mobile: collapsible — intro visible, rest behind read more */}
            <div className="sm:hidden text-left">
              <Text variant="p1" className="text-prim max-sm:text-p2">
                {descExpanded
                  ? (content.hero_desc ?? "")
                  : (content.hero_desc_short ?? content.hero_desc ?? "")}
              </Text>
              <button
                type="button"
                onClick={() => setDescExpanded((v) => !v)}
                className="mt-s2 text-brand text-p2 underline underline-offset-4"
              >
                {descExpanded
                  ? (content.hero_read_less ?? "Read less")
                  : (content.hero_read_more ?? "Read more")}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* mobile: tagline sits above the gallery (on sm+ it lives below, next to the refer) */}
      <div className="sm:hidden px-page max-w-page mx-auto pb-s3">
        <Text variant="p1" className="max-w-[320px] text-prim text-p2 text-left">
          {content.hero_tagline ?? "Product creation is changing. Shorter cycles. Faster Outcome."}
        </Text>
      </div>

      {/* gallery — full-bleed scroll container; the card itself is layout-width,
          so the active card lands in the content area and neighbours peek to the
          viewport edges. No max-w-page (it would clip the peek) and no overflow-hidden. */}
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="hero-in"
        style={{ "--hero-delay": "0.35s" } as React.CSSProperties}
      >
        <div className="hero-gallery">
        <Slider
          ref={sliderRef}
          cols={1}
          gapToken="s3"
          onViewChange={onViewChange}
          containerClassName={GALLERY_CONTAINER_CLASS}
          slideClassName={SLIDE_CLASS}
        >
          {items.map((item, i) => (
            <div key={item.id} className="relative w-full h-full">
              {item.type === "video" ? (
                <div className="hero-video-container w-full h-full bg-black flex items-center justify-center">
                <video
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={item.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover block"
                />
                </div>
              ) : item.mobile_src ? (
                <picture>
                  <source media="(max-width: 639px)" srcSet={item.mobile_src} />
                  <img
                    src={item.src}
                    alt={item.alt ?? ""}
                    loading={i === 0 ? "eager" : "lazy"}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </picture>
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt ?? ""}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="100vw"
                />
              )}
              {item.overlay === "logo_center" && (
                <img
                  src="/images/slider/payrlylogoshort.svg"
                  alt="Payrly"
                  className="absolute inset-0 m-auto h-s10 w-auto z-10"
                />
              )}
              {(item.overlay === "logo_bottom" || item.overlay === "logo_bottom_invert") && (
                <img
                  src="/images/slider/payrlylogo.svg"
                  alt="Payrly"
                  className={`absolute bottom-s5 left-s5 h-s8 z-10${item.overlay === "logo_bottom_invert" ? " hidden sm:block invert" : ""}`}
                />
              )}
            </div>
          ))}
        </Slider>
        </div>
      </div>

      <div className="px-page max-w-page mx-auto pt-s3 pb-[24px]">
        <div className="hero-in flex flex-col sm:flex-row items-start sm:items-end justify-between gap-s6 sm:gap-0"
          style={{ "--hero-delay": "0.2s" } as React.CSSProperties}
        >
          <Text variant="p1" className="max-sm:hidden max-sm:order-2 max-w-[320px] text-prim text-left">
            {content.hero_tagline ?? "Product creation is changing. Shorter cycles. Faster Outcome."}
          </Text>
          {refer && (
            <Refer
              name={refer.name}
              role={refer.role}
              avatar={refer.avatar}
              className="max-sm:order-1 sm:pr-s1 sm:w-auto sm:ml-auto"
            />
          )}
        </div>
      </div>
    </section>
  );
}
