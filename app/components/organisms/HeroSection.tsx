"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { Heading, Text } from "@/app/components/atoms";
import { Refer, Slider } from "@/app/components/molecules";
import type { SliderView } from "@/app/components/molecules/Slider";
import { useSliderSection } from "@/app/hooks/useSliderSection";
import type { SiteContent } from "@/lib/content";

const GALLERY_IMAGES = [
  { src: "/images/sline01.png", alt: "Native Works – projekt 1" },
  { src: "/images/sline02.png", alt: "Native Works – projekt 2" },
  { src: "/images/sline01.png", alt: "Native Works – projekt 3" },
  { src: "/images/sline02.png", alt: "Native Works – projekt 4" },
];

const SLIDE_CLASS =
  "!w-[calc(min(100vw,_1440px)_-_2_*_var(--gutter))] rounded-[21px] overflow-hidden h-[576px] sm:h-[480px] lg:h-[648px] relative";

type Props = { content: SiteContent };

export function HeroSection({ content }: Props) {
  const { sliderRef, containerRef, onViewChange: registerViewChange } =
    useSliderSection("hero-gallery", GALLERY_IMAGES.length, 1);
  const [firstVisible, setFirstVisible] = useState(0);

  const onViewChange = useCallback(
    (view: SliderView) => {
      setFirstVisible(view.firstVisible);
      registerViewChange(view);
    },
    [registerViewChange],
  );

  const galleryAuthors = [
    { name: content.hero_refer_name ?? "Gabriel Hudoba", role: content.hero_refer_role ?? "Brand, Design", avatar: content.hero_refer_avatar ?? "/images/gabo.png" },
    { name: content.hero_refer2_name ?? "Milan Tibensky", role: content.hero_refer2_role ?? "Data, Growth", avatar: content.hero_refer2_avatar ?? "/images/milan.png" },
    { name: content.hero_refer3_name ?? "Maria Susteka", role: content.hero_refer3_role ?? "Design", avatar: content.hero_refer3_avatar },
    { name: content.hero_refer4_name ?? "Martin Mroc", role: content.hero_refer4_role ?? "Design", avatar: content.hero_refer4_avatar ?? "/images/martin.png" },
  ];
  const refer = galleryAuthors[firstVisible] ?? galleryAuthors[0];

  return (
    <section ref={containerRef as React.RefObject<HTMLElement>} style={{ paddingTop: "var(--hero-section-pt)" }}>
      {/* text block — constrained to page width */}
      <div className="px-page max-w-page mx-auto max-sm:pb-s6 sm:pb-0">
        <div className="hero-in pt-0 max-sm:pt-s12 sm:pt-s15 lg:pt-s18 sm:mt-s3 lg:mt-s6 flex flex-col items-start sm:items-center gap-s6 text-left sm:text-center">
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

      {/* gallery — full viewport width, left gutter only; peek reaches screen right edge */}
      <div
        className="hero-in"
        style={{ "--hero-delay": "0.35s" } as React.CSSProperties}
      >
        <Slider
          ref={sliderRef}
          cols={1}
          gapToken="s3"
          onViewChange={onViewChange}
          containerClassName="px-[var(--gutter)] [scroll-padding-inline:var(--gutter)]"
          slideClassName={SLIDE_CLASS}
        >
          {GALLERY_IMAGES.map((img, i) => (
            <Image
              key={i}
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          ))}
        </Slider>
      </div>

      <div className="px-page max-w-page mx-auto sm:hidden pt-s3">
        <Refer name={refer.name} role={refer.role} avatar={refer.avatar} />
      </div>
    </section>
  );
}
