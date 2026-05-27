"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Heading, Text } from "@/app/components/atoms";
import { IconButton } from "@/app/components/molecules";
import { GlassCard } from "@developer-hub/liquid-glass";
import { useNavOpen } from "@/app/components/organisms";

function Attribution({ name, role, avatar, className }: { name: string; role: string; avatar?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-s5${className ? ` ${className}` : ""}`}>
      <div className="size-s8 rounded-pill bg-surface shrink-0 overflow-hidden relative">
        {avatar && <Image src={avatar} alt={name} fill className="object-cover" />}
      </div>
      <div className="flex flex-col gap-0">
        <Text variant="l2" as="span">
          {name}
        </Text>
        <Text variant="l3" as="span">
          {role}
        </Text>
      </div>
    </div>
  );
}

const SLIDES = 4;
const GALLERY_IMAGES = [
  { src: "/images/sline01.png", alt: "Native Works – projekt 1" },
  { src: "/images/sline02.png", alt: "Native Works – projekt 2" },
  { src: "/images/sline01.png", alt: "Native Works – projekt 3" },
  { src: "/images/sline02.png", alt: "Native Works – projekt 4" },
];
const AUTOPLAY_INTERVAL = 7000;

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [controlVisible, setControlVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const navOpen = useNavOpen();
  const galleryRef = useRef<HTMLDivElement>(null);

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
    <main className="bg-white overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="px-s9 max-w-s15 mx-auto">

        {/* Gallery slide controls — fixed below the nav pill */}
        <div className="fixed top-[80px] left-0 right-0 z-50 flex justify-center">
          <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${controlVisible && !navOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
            <GlassCard cornerRadius={9999} padding="0px" blurAmount={0} displacementScale={80}>
              <div className="flex items-center justify-between px-s6 h-s8 w-[300px] bg-[#D9D9D9]/20">
                <IconButton icon="chevron-left" label="Predchádzajúci" onClick={() => setSlide(s => (s - 1 + SLIDES) % SLIDES)} />
                <div className="flex items-center justify-center gap-s4 flex-1 mx-s4 h-s4">
                  {Array.from({ length: SLIDES }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => setSlide(i)}
                      className={`h-s4 rounded-pill transition-[width,background-color] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer shrink-0 ${
                        slide === i ? "bg-prim w-s9" : "bg-prim/20 w-s4"
                      }`}
                    />
                  ))}
                </div>
                <IconButton icon="chevron-right" label="Nasledujúci" onClick={() => setSlide(s => (s + 1) % SLIDES)} />
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Hero — headline 84vh, galéria 640px začína na 84vh (väčšina pod foldom) */}

        {/* ── headline — 84vh ── */}
        <div className="flex flex-col" style={{ height: "84vh" }}>

          {/* flex-1 siaha od vrchu 84vh až po hranu galérie */}
          <div className="flex-1 flex flex-col">
            {/* centered heading + body */}
            <div className="flex-1 flex flex-col items-center justify-center gap-s7 pt-s8">
              <Heading variant="h2" className="max-w-[672px] text-center">
                New era of digital product design.
              </Heading>
              <Text variant="p2" className="max-w-[545px] text-center text-prim">
                A curated group of product specialists working on your mobile app or
                web system. Inside your team. Solving product problems from early
                concepts to product friction. With a level of speed previously
                impossible. Delivered through to production-ready output.
              </Text>
            </div>

            {/* spodný riadok — tesne pri hrane galérie */}
            <div className="flex items-end justify-between pb-s7">
              <Text variant="p1" className="max-w-[339px] text-prim">
                Product creation is changing. Shorter cycles. Faster Outcome.
              </Text>
              <Attribution name="Martin Mroc" role="CDO, Vibe Studio" avatar="/images/martin.png" className="pr-s4" />
            </div>
          </div>
        </div>

        {/* ── galéria — 640px ── */}
        <div
          ref={galleryRef}
          className="w-full rounded-lg overflow-hidden bg-surface relative"
          style={{ height: "640px" }}
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
      </section>

      {/* ─── Stats ─── */}
      <section
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(9,14,58,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "25px 25px",
        }}
      >
      <div className="py-s10 px-s9 max-w-s15 mx-auto">
        {/* Section heading */}
        <Heading variant="h2" className="max-w-[481px] mb-s6">
          Better products.
          <br />
          Delivered faster.
        </Heading>

        {/* Subheading */}
        <Text variant="p2" className="mb-s9">
          Fewer steps. Higher quality. AI-accelerated.
        </Text>

        {/* Stats row */}
        <div className="grid grid-cols-3">
          {/* Stat 1 */}
          <div className="flex flex-col gap-s4">
            <Heading variant="numb1" className="h-s9">2 weeks</Heading>
            <Text variant="p2" className="max-w-[260px]">
              Avg. time to first value
            </Text>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col gap-s4">
            <Heading variant="numb1" className="h-s9">33%</Heading>
            <Text variant="p2" className="max-w-[300px]">
              Increase in weekly active user retention in Kontentino by
            </Text>
            <div className="mt-s5">
              <Attribution name="Milan Tibansky" role="Growth Lead" avatar="/images/milan.png" />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col gap-s4">
            <Heading variant="numb1" className="h-s9">8/10</Heading>
            <Text variant="p2" className="max-w-[260px]">
              Clients continuing after first sprint
            </Text>
          </div>
        </div>
      </div>
      </section>
    </main>
  );
}
