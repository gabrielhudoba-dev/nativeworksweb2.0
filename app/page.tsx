"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge, Heading, Icon, Text } from "@/app/components/atoms";
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
      <section className="px-s9 pb-s9 max-w-s15 mx-auto">

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
      <div className="py-s9 px-s9 max-w-s15 mx-auto">
        <Heading variant="h2" className="max-w-[481px] mb-s6">
          Better products.
          <br />
          Delivered faster.
        </Heading>
        <Text variant="p2" className="mb-s9">
          Fewer steps. Higher quality. AI-accelerated.
        </Text>
        <div className="grid grid-cols-3">
          <div className="flex flex-col gap-s4">
            <Heading variant="numb1">2 weeks</Heading>
            <Text variant="p3" className="max-w-[260px]">Avg. time to first value</Text>
          </div>
          <div className="flex flex-col gap-s4">
            <Heading variant="numb1">33%</Heading>
            <Text variant="p3" className="max-w-[300px]">Increase in weekly active user retention in Kontentino by</Text>
            <div className="mt-s5">
              <Attribution name="Milan Tibansky" role="Growth Lead" avatar="/images/milan.png" />
            </div>
          </div>
          <div className="flex flex-col gap-s4">
            <Heading variant="numb1">8/10</Heading>
            <Text variant="p3" className="max-w-[260px]">Clients continuing after first sprint</Text>
          </div>
        </div>
      </div>
      </section>

      {/* ─── Intervening ─── */}
      <section className="py-s9 px-s9 max-w-s15 mx-auto">
        <Heading variant="h2" className="mb-s9">
          Intervening<br />at any stage.
        </Heading>
        <div className="grid grid-cols-4 gap-[19px]">
          {[
            { title: "Early Product", desc: "Building from the ground up, with quality from day one" },
            { title: "Scaling Product", desc: "New features, growing complexity, need for structure" },
            { title: "Capacity Gaps", desc: "Internal team can't keep up with speed or scope" },
            { title: "Competitive Pressure", desc: "Market moves faster than the product" },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-surface rounded-[24px] relative flex flex-col justify-end gap-s6 pt-s6 pb-s8 px-s6 min-h-[427px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-s6 left-s6" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M21.8315 3.93101C23.0951 6.01184 24 8.86519 24 12.0011C24 15.137 23.0951 17.9904 21.8315 20.0712C21.1697 21.1611 20.375 22.0524 19.2036 22.7423C17.2046 23.9196 14.5407 24.0101 11.8844 23.9992C9.29745 23.9887 6.71767 23.9077 4.76617 22.7427C3.61594 22.0559 2.83362 21.1663 2.16848 20.0709C0.90491 17.9901 5.66762e-06 15.1368 0 12.0009C1.23422e-07 8.86493 0.90491 6.01156 2.16848 3.93072C2.86221 2.78829 3.71166 1.87761 4.94628 1.19194C6.86193 0.128048 9.36982 0.00590822 11.8844 0.000173082C14.469 -0.0057218 17.0607 0.13396 19.0235 1.19194C20.3095 1.88509 21.1451 2.80068 21.8315 3.93101ZM15.1205 1.79569C14.7968 1.94194 14.4819 2.1315 14.1782 2.36154C16.1526 4.43266 17.5286 7.99989 17.5286 12.0008C17.5286 15.1367 16.6237 17.9901 15.3601 20.0709C14.7306 21.1077 13.9701 21.9651 13.1141 22.5649C15.1538 22.5634 16.7534 21.4088 17.8879 19.5407C19.0443 17.6363 19.6458 14.9743 19.6458 12.0008C19.6458 9.0273 19.0443 6.36529 17.8879 4.46093C17.1135 3.18581 16.1624 2.26662 15.1205 1.79569ZM16.7381 1.43733C16.6166 1.43733 16.4958 1.44327 16.3756 1.45496C17.2212 2.05382 17.9726 2.90442 18.5958 3.93072C19.8593 6.01155 20.7643 8.86489 20.7643 12.0008C20.7643 15.1367 19.8594 17.9901 18.5958 20.0709C17.9662 21.1077 17.2058 21.9651 16.3497 22.5649C18.3892 22.5649 19.9895 21.4085 21.1236 19.541C22.28 17.6366 22.8815 14.9746 22.8815 12.0011C22.8815 9.0276 22.28 6.36558 21.1236 4.46122C19.9626 2.54932 18.4041 1.43734 16.7381 1.43733ZM7.2619 1.43704C5.59582 1.43705 4.0374 2.54908 2.87641 4.46097C1.72 6.36534 1.11849 9.02735 1.11849 12.0009C1.1185 14.9744 1.72 17.6364 2.87641 19.5407C3.89742 21.2221 5.50251 22.6394 7.41435 22.5615C6.56026 21.9618 5.80152 21.1057 5.17315 20.0709C3.90959 17.9901 3.00467 15.1367 3.00467 12.0008C3.00468 8.8649 3.90959 6.01155 5.17315 3.93072C5.80262 2.89411 6.56292 2.0368 7.41884 1.43704H7.2619ZM13.5018 2.95992C13.1474 3.32146 12.8136 3.74246 12.5054 4.21758C13.8481 6.52934 14.5239 9.30444 14.5239 12.0009C14.5239 15.1368 13.619 17.9901 12.3555 20.0709C11.7271 21.1058 10.9683 21.9618 10.1142 22.5615C12.0261 22.6394 13.6312 21.2221 14.6522 19.5407C15.8086 17.6363 16.4101 14.9743 16.4101 12.0008C16.4101 8.12408 15.2854 4.79151 13.5018 2.95992ZM10.2667 1.43704C8.60057 1.43705 7.04207 2.54903 5.88108 4.46093C4.72467 6.36529 4.12317 9.02731 4.12316 12.0008C4.12316 14.9743 4.72467 17.6363 5.88108 19.5407C6.68399 20.8629 7.67702 21.8025 8.76426 22.2564C9.0806 22.1243 9.38888 21.9511 9.6869 21.7393C7.66122 19.6841 6.24033 16.0664 6.24032 12.0008C6.24033 8.8649 7.14524 6.01155 8.4088 3.93072C9.03827 2.89411 9.79857 2.0368 10.6545 1.43704H10.2667ZM13.5023 1.43704C11.8362 1.43705 10.2777 2.54903 9.11673 4.46093C7.96032 6.36529 7.35882 9.02731 7.35881 12.0008C7.35882 15.9605 8.53227 19.3524 10.3826 21.1571C10.7764 20.7745 11.146 20.3195 11.4848 19.7993C10.3138 17.7461 9.47606 15.0037 9.47606 12.0011C9.47607 9.01434 10.297 6.28388 11.4668 4.23308C12.0868 3.14604 12.8833 2.1502 13.8654 1.45477C13.745 1.44303 13.624 1.43704 13.5023 1.43704ZM11.9916 5.11537C11.0712 6.95395 10.5946 9.35412 10.5946 12.0011C10.5946 14.6569 11.0674 17.0643 11.9989 18.9051C12.9255 17.0642 13.4054 14.6568 13.4054 12.0009C13.4054 9.592 13.038 7.16334 11.9916 5.11537Z" fill="#090E3A"/>
              </svg>
              <Heading variant="h3">{title}</Heading>
              <Text variant="p3">{desc}</Text>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Inside the team ─── */}
      <section className="py-s9 px-s9 max-w-s15 mx-auto">
        <Heading variant="h2" className="mb-s6">
          Inside the team.<br />Inside the product.
        </Heading>
        <Text variant="p2" className="mb-s8 max-w-[800px]">
          We work closely in to your product focusing on specific problem.
        </Text>
        <div className="grid grid-cols-3 gap-[19px] items-start">

          {/* Product Sprint — featured */}
          <div className="bg-surface rounded-[12px] flex flex-col pt-s8 pb-s7 ring-2 ring-prim">
            <div className="flex flex-col gap-s5 px-s7 pb-s8">
              <Heading variant="h3">Product Sprint</Heading>
              <Text variant="p3">A short, focused sprint to identify key frictions, define improvements, and design a selected part of the product.</Text>
              <span className="border-b border-prim inline-block self-start">
                <Text variant="p3" as="span">Read more</Text>
              </span>
            </div>

            <div className="flex flex-col gap-s6 px-s7 pb-s7 pt-s7 border-t border-prim/10 opacity-60">
              {/* Feature: Senior-led */}
              <div className="flex gap-s5 items-start">
                <Icon name="microscope" size="md" className="shrink-0 mt-[3px]" />
                <div className="flex flex-col gap-s3">
                  <Text variant="l2" as="span">Senior-led execution</Text>
                  <Text variant="l2" as="span" className="font-normal">15+ year experienced industry leaders and authorities</Text>
                </div>
              </div>
              {/* Feature: Fast delivery */}
              <div className="flex gap-s5 items-start">
                <Icon name="person-simple-run" size="md" className="shrink-0 mt-[3px]" />
                <div className="flex flex-col gap-s3">
                  <Text variant="l2" as="span">Fast delivery cycle</Text>
                  <div className="flex items-center gap-[6px]">
                    <Badge variant="ai">AI</Badge>
                    <Text variant="l2" as="span" className="font-normal">integrated process</Text>
                  </div>
                </div>
              </div>
              {/* Feature: Designed in code */}
              <div className="flex gap-s5 items-start">
                <Icon name="brackets-curly" size="md" className="shrink-0 mt-[3px]" />
                <div className="flex flex-col gap-s3">
                  <Text variant="l2" as="span">Designed in code</Text>
                  <Text variant="l2" as="span" className="font-normal">Production ready solutions</Text>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-s6 px-s6 pt-s6">
              <div className="flex items-center justify-between px-s5">
                <Text variant="h5" as="span">€5K</Text>
                <Text variant="h5" as="span">2 weeks</Text>
              </div>
              <button
                type="button"
                className="flex items-center justify-between h-s8 px-s7 rounded-pill bg-brand text-white w-full cursor-pointer"
              >
                <Text variant="p2" as="span" className="text-white">{"Let's Start"}</Text>
                <Icon name="arrow-right" size="md" className="text-white" />
              </button>
            </div>
          </div>

          {/* Continuous Partnership */}
          <div className="bg-surface rounded-[12px] flex flex-col justify-between pt-s8 pb-s7 px-s7 min-h-[503px]">
            <div className="flex flex-col gap-s5">
              <Heading variant="h3">Continuous Partnership</Heading>
              <Text variant="p3">A short, focused sprint to identify key frictions, define improvements, and design a selected part of the product.</Text>
              <span className="border-b border-prim inline-block self-start">
                <Text variant="p3" as="span">Read more</Text>
              </span>
            </div>
            <div className="flex flex-col gap-s6">
              <div className="flex items-center justify-between px-s4">
                <Text variant="h5" as="span">€5k – €20k</Text>
                <Text variant="h5" as="span">Month</Text>
              </div>
              <button
                type="button"
                className="flex items-center justify-between h-s8 px-s7 rounded-pill bg-white text-prim w-full cursor-pointer"
              >
                <Text variant="p2" as="span">{"Let's Start"}</Text>
                <Icon name="arrow-right" size="md" />
              </button>
            </div>
          </div>

          {/* Last Mile Sprint */}
          <div className="bg-surface rounded-[12px] flex flex-col justify-between pt-s8 pb-s7 px-s7 min-h-[503px]">
            <div className="flex flex-col gap-s5">
              <Heading variant="h3">Last Mile Sprint</Heading>
              <Text variant="p3">A focused sprint to validate, refine, and bring your product to a usable, production-ready state.</Text>
              <span className="border-b border-prim inline-block self-start">
                <Text variant="p3" as="span">Read more</Text>
              </span>
            </div>
            <div className="flex flex-col gap-s6">
              <div className="flex items-center justify-between px-s4">
                <Text variant="h5" as="span">€10k</Text>
                <Text variant="h5" as="span">4 weeks</Text>
              </div>
              <button
                type="button"
                className="flex items-center justify-between h-s8 px-s7 rounded-pill bg-white text-prim w-full cursor-pointer"
              >
                <Text variant="p2" as="span">{"Let's Start"}</Text>
                <Icon name="arrow-right" size="md" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ─── Page links ─── */}
      <section className="px-s9 py-s9 max-w-s15 mx-auto">
        {[
          { label: "Collective", href: "/collective" },
          { label: "Case Studies", href: "/case-studies" },
          { label: "Capabilities", href: "/capabilities" },
          { label: "Process", href: "/process-insights" },
        ].map(({ label, href }) => (
          <div key={href}>
            <Link
              href={href}
              className="block font-display font-medium text-h2 leading-[0.9] tracking-[-0.02em] text-prim py-s7"
            >
              {label}
            </Link>
          </div>
        ))}
      </section>

    </main>
  );
}
