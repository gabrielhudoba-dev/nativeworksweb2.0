"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Badge, Heading, Icon, Text } from "@/app/components/atoms";
import { ServiceCard } from "@/app/components/molecules/ServiceCard";
import { Slider } from "@/app/components/molecules/Slider";
import type { SliderHandle } from "@/app/components/molecules/Slider";
import { useSliderSection } from "@/app/hooks/useSliderSection";
import type { SiteContent, Service } from "@/lib/content";

function handleLetStart(e: React.MouseEvent, card: { name: string; detail: string }) {
  e.stopPropagation();
  const subject = encodeURIComponent(`${card.name} — Let's Start`);
  const body = encodeURIComponent(
    `Hi Native Works,\n\nI'm interested in the ${card.name} (${card.detail}).\n\nPlease get in touch.\n\nBest regards,`
  );
  window.location.href = `mailto:hello@nativeworks.com?subject=${subject}&body=${body}`;
}

type Props = { content: SiteContent; services: Service[] };

export function ServicesSection({ content, services }: Props) {
  const [activeCard, setActiveCard] = useState(0);
  const { sliderRef, containerRef, onViewChange } = useSliderSection("services-slider", services.length);
  const mobileSliderRef = useRef<SliderHandle>(null);
  const desktopSliderRef = useRef<SliderHandle>(null);

  // Proxy sliderRef to whichever slider is currently visible
  useEffect(() => {
    sliderRef.current = {
      scrollToIndex: (i) => {
        if (window.innerWidth < 640) mobileSliderRef.current?.scrollToIndex(i);
        else desktopSliderRef.current?.scrollToIndex(i);
      },
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewChange = useCallback((view: Parameters<typeof onViewChange>[0]) => {
    setActiveCard(view.firstVisible);
    onViewChange(view);
  }, [onViewChange]);

  function parseFeatures(desc: string): { text: string; features: string[] } {
    const idx = desc.indexOf("\n\nFeatures:");
    if (idx < 0) return { text: desc, features: [] };
    return {
      text: desc.slice(0, idx).trim(),
      features: desc.slice(idx + "\n\nFeatures:".length).trim().split("|").map(f => f.trim()),
    };
  }

  const cards = services.map((card, i) => {
    const { text, features } = parseFeatures(card.desc);
    return (
      <ServiceCard
        key={card.title}
        title={card.title}
        desc={text}
        price={card.price}
        duration={card.duration}
        active={activeCard === i}
        onClick={() => setActiveCard(i)}
        onLetStart={(e) => handleLetStart(e, { name: card.title, detail: `${card.price} / ${card.duration}` })}
        features={features}
      />
    );
  });

  return (
    <section id="services" className="max-sm:pt-s6 sm:pt-s9 lg:pt-s15 pb-s6 lg:pb-s15 px-page max-w-page mx-auto">
      <Heading variant="h2" className="mb-s3">
        {(content.services_title ?? "Inside the team.\nInside the product.").split("\n").map((line, i, arr) => (
          <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
        ))}
      </Heading>
      <div ref={containerRef} className="mt-s9">
        {/* Mobile: full-bleed cols=1 slider */}
        <div className="sm:hidden">
          <Slider
            ref={mobileSliderRef}
            cols={1}
            containerClassName="py-s3 -my-s3 -mx-[var(--gutter)] px-[var(--gutter)] scroll-px-[var(--gutter)]"
            onViewChange={handleViewChange}
          >
            {cards}
          </Slider>
        </div>

        {/* Tablet/Desktop: 3-col slider with indicator */}
        <div className="hidden sm:block">
          <Slider
            ref={desktopSliderRef}
            cols={3}
            gapToken="s3"
            containerClassName="py-s3 -my-s3 -mx-[var(--gutter)] px-[var(--gutter)] scroll-px-[var(--gutter)]"
            onViewChange={handleViewChange}
          >
            {cards}
          </Slider>
        </div>
      </div>
    </section>
  );
}
