"use client";

import { useEffect, useRef } from "react";
import { useSliderNav } from "@/app/context/SliderNavContext";

export function CustomCursor() {
  const posRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef<HTMLDivElement>(null);
  const { nav } = useSliderNav();
  const navRef = useRef(nav);
  navRef.current = nav;

  useEffect(() => {
    const pos = posRef.current;
    const rot = rotRef.current;
    if (!pos || !rot) return;

    const onMove = (e: MouseEvent) => {
      pos.style.translate = `${e.clientX}px ${e.clientY}px`;
      // Tilt only when actively controlling a slider; otherwise stay upright
      const tilt = navRef.current ? (e.clientX < window.innerWidth / 2 ? -40 : 40) : 0;
      rot.style.rotate = `${tilt}deg`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    // pos layer: tracks mouse — starts off-screen until first mousemove
    <div
      ref={posRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ translate: "-200px -200px", mixBlendMode: "difference" }}
    >
      {/* center layer: shift left by 50% so the tip (top-center of SVG) lands on the hotspot */}
      <div style={{ transform: "translate(-50%, 0)" }}>
        {/* rot layer: rotate around tip (top-center), not the element center */}
        <div
          ref={rotRef}
          style={{ transition: "rotate 0.18s cubic-bezier(0.4,0,0.2,1)", transformOrigin: "50% 0" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cursor.svg" alt="" width={13} height={30} />
        </div>
      </div>
    </div>
  );
}
