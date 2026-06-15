"use client";

import { useEffect, useRef } from "react";
import { useSliderNav } from "@/app/context/SliderNavContext";

// Visible footprint of the cursor SVG (tip at top-center, body extends down).
const CURSOR_W = 13;
const CURSOR_H = 30;
// What a click should be allowed to land on. Mirrors the gallery-nav skip list
// (GlobalGalleryNav) so a redirected click never also triggers prev/next.
const INTERACTIVE = "a, button, input, select, textarea, [role='button'], [tabindex]";

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

    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      pos.style.translate = `${e.clientX}px ${e.clientY}px`;
      // Tilt only when actively controlling a slider; otherwise stay upright
      const tilt = navRef.current ? (e.clientX < window.innerWidth / 2 ? -40 : 40) : 0;
      rot.style.rotate = `${tilt}deg`;
    };

    // Forgiving hit area: a click should land on anything under the arrow's
    // visible footprint, not just the 1px tip (the OS hotspot). If the tip
    // isn't over an interactive element, scan the arrow's body and redirect
    // the click to the nearest interactive element found there.
    const interactiveAt = (x: number, y: number): HTMLElement | null => {
      const el = document.elementFromPoint(x, y)?.closest(INTERACTIVE);
      return el instanceof HTMLElement ? el : null;
    };

    const onClick = (e: MouseEvent) => {
      if (!e.isTrusted) return; // ignore the synthetic click we dispatch below
      const { clientX: x, clientY: y } = e;
      if (interactiveAt(x, y)) return; // tip already on a target — leave native click alone

      const half = CURSOR_W / 2;
      // Sample the arrow footprint top-down (points nearest the tip win first).
      const points: [number, number][] = [
        [x, y + 8], [x, y + 16], [x, y + CURSOR_H],
        [x - half, y + 12], [x + half, y + 12],
        [x - half, y + CURSOR_H], [x + half, y + CURSOR_H],
      ];
      for (const [px, py] of points) {
        const hit = interactiveAt(px, py);
        if (hit) {
          e.preventDefault();
          e.stopPropagation(); // capture phase: also blocks gallery-nav prev/next
          hit.click();
          return;
        }
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick, true); // capture: run before gallery-nav
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick, true);
    };
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
          <img src="/cursor.svg" alt="" width={CURSOR_W} height={CURSOR_H} />
        </div>
      </div>
    </div>
  );
}
