"use client";

import { useEffect, useState } from "react";

/**
 * Dev-only 24px baseline grid overlay. NOT part of the page UI.
 *
 *   g    → toggle the 24px lines (also ?grid in the URL)
 *   esc  → hide
 *
 * The lines layer is position:absolute over the full document height, so it
 * scrolls natively with the page and stays pixel-crisp.
 */
export function RhythmDev() {
  const [lines, setLines] = useState(false);
  const [docHeight, setDocHeight] = useState(0);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("grid")) setLines(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "g" || e.key === "G") { e.preventDefault(); setLines((v) => !v); }
      else if (e.key === "Escape") { setLines(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!lines) return;
    const measure = () => setDocHeight(document.documentElement.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [lines]);

  if (!lines) return null;

  return (
    <>
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: docHeight || "100%",
          zIndex: 9998,
          pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(50,85,230,0.35) 0, rgba(50,85,230,0.35) 1px, transparent 1px, transparent 24px)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 9999,
          pointerEvents: "none",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          lineHeight: "16px",
          color: "rgba(9,14,58,0.7)",
          background: "rgba(245,245,247,0.92)",
          border: "1px solid rgba(9,14,58,0.12)",
          borderRadius: 8,
          padding: "8px 12px",
          backdropFilter: "blur(4px)",
        }}
      >
        24px grid · <b>g</b> toggle · <b>esc</b> hide
      </div>
    </>
  );
}
