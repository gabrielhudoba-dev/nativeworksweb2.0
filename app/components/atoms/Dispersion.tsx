"use client";

/**
 * NW/Disperse — dispersion effect token for the NativeWorks design system.
 *
 * Layers: crisp base → optional soft-blur underlay → spectral overlay (SVG filter),
 * revealed by a directional opacity mask. Static = mask fixed at 225deg (top-right);
 * dynamic = mask angle eases toward the cursor (shortest arc, 6%/frame).
 *
 * Usage:
 *   <DispersionDefs />                         // once per page (in the layout)
 *   <Dispersion>Dispersion.</Dispersion>
 *   <Dispersion dynamic softBlur={1.2}>glass.</Dispersion>
 *   <DispersionBox dynamic className="rounded-[21px] border …">…</DispersionBox>
 *
 * Rules:
 *   - One strength only — never scale the filter offsets/blurs.
 *   - One spectrum — monochrome gray echoes. Never recolor per-instance.
 *   - Always directional — the effect must dissolve; never show it uniformly.
 *   - One dispersion moment per viewport.
 *   - Never on body text — headings, hero moments, panel edges only.
 */

import { useEffect, useRef } from "react";
import type { HTMLAttributes } from "react";

/* ── SVG filter defs — final values, do not alter ─────────────────────────── */

export function DispersionDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <filter id="nw-disperse" x="-50%" y="-50%" width="200%" height="200%">
          {/* band 1 · light gray */}
          <feColorMatrix in="SourceAlpha" type="matrix"
            values="0 0 0 0 0.50  0 0 0 0 0.50  0 0 0 0 0.50  0 0 0 0.55 0" result="c1" />
          <feOffset in="c1" dx="-1.5" dy="0.75" result="o1" />
          <feGaussianBlur in="o1" stdDeviation="0.85" result="f1" />
          {/* band 2 · mid gray */}
          <feColorMatrix in="SourceAlpha" type="matrix"
            values="0 0 0 0 0.34  0 0 0 0 0.34  0 0 0 0 0.34  0 0 0 0.55 0" result="c2" />
          <feOffset in="c2" dx="1.5" dy="-0.75" result="o2" />
          <feGaussianBlur in="o2" stdDeviation="0.9" result="f2" />
          {/* band 3 · dark gray */}
          <feColorMatrix in="SourceAlpha" type="matrix"
            values="0 0 0 0 0.20  0 0 0 0 0.20  0 0 0 0 0.20  0 0 0 0.42 0" result="c3" />
          <feOffset in="c3" dx="0.28" dy="1.5" result="o3" />
          <feGaussianBlur in="o3" stdDeviation="0.95" result="f3" />
          <feMerge>
            <feMergeNode in="f1" />
            <feMergeNode in="f2" />
            <feMergeNode in="f3" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/* ── cursor-follow mask hook ──────────────────────────────────────────────── */

const DEFAULT_ANGLE = 225;

function buildMaskCss(angle: number, start: number, end: number) {
  return `linear-gradient(${angle.toFixed(1)}deg, #000 ${start}%, transparent ${end}%)`;
}

function useCursorMask(
  anchorRef: React.RefObject<HTMLElement | null>,
  targetRefs: React.RefObject<HTMLElement | null>[],
  enabled: boolean,
  start: number,
  end: number,
) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cur = DEFAULT_ANGLE;
    let target = DEFAULT_ANGLE;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const r = anchor.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      target = ((Math.atan2(dx, -dy) * 180) / Math.PI + 180 + 360) % 360;
    };

    const tick = () => {
      const diff = ((target - cur + 540) % 360) - 180;
      cur = Math.abs(diff) < 0.05 ? target : (cur + diff * 0.06 + 360) % 360;
      const css = buildMaskCss(cur, start, end);
      targetRefs.forEach((ref) => {
        const el = ref.current;
        if (el) {
          el.style.webkitMaskImage = css;
          el.style.maskImage = css;
        }
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [anchorRef, targetRefs, enabled, start, end]);
}

/* ── text usage ───────────────────────────────────────────────────────────── */

type DispersionProps = {
  children: React.ReactNode;
  /** Mask follows the cursor */
  dynamic?: boolean;
  /** Gradient stop where full visibility ends (%) */
  maskStart?: number;
  /** Gradient stop where the effect is fully dissolved (%) */
  maskEnd?: number;
  /** Optional soft-blur underlay in px (tuned value: 1.2). 0 = off */
  softBlur?: number;
  /**
   * Replicate the base text's transform so the overlay aligns correctly.
   * Required when wrapping a DS Heading — pass its baseline-nudge class value,
   * e.g. overlayTransform="translateY(14px)" for h1.
   */
  overlayTransform?: string;
  as?: React.ElementType;
} & HTMLAttributes<HTMLElement>;

export function Dispersion({
  children,
  dynamic = false,
  maskStart = 12,
  maskEnd = 60,
  softBlur = 0,
  overlayTransform,
  as: Tag = "span",
  className,
  style,
  ...rest
}: DispersionProps) {
  const anchorRef = useRef<HTMLElement>(null);
  const softRef = useRef<HTMLElement>(null);
  const fxRef = useRef<HTMLElement>(null);
  useCursorMask(anchorRef, [softRef, fxRef], dynamic, maskStart, maskEnd);

  const mask = buildMaskCss(DEFAULT_ANGLE, maskStart, maskEnd);
  const overlayBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    WebkitMaskImage: mask,
    maskImage: mask,
    transform: overlayTransform,
  };

  return (
    <Tag
      ref={anchorRef}
      className={className}
      style={{ position: "relative", display: "inline-block", ...style }}
      {...rest}
    >
      {children}
      {softBlur > 0 && (
        <Tag
          ref={softRef}
          aria-hidden="true"
          style={{ ...overlayBase, filter: `blur(${softBlur}px)` }}
        >
          {children}
        </Tag>
      )}
      <Tag
        ref={fxRef}
        aria-hidden="true"
        style={{ ...overlayBase, filter: "url(#nw-disperse)" }}
      >
        {children}
      </Tag>
    </Tag>
  );
}

/* ── box usage ────────────────────────────────────────────────────────────── */

/**
 * Box variant. mask-image clips at the border box, but the filter paints
 * outside it — so the mask lives on an oversized wrapper (inset: -40px) and
 * the filtered copy of the box sits inside it at inset: 40px.
 * `className`/`style` must fully describe the box's visual (border, radius,
 * background) since it is rendered twice.
 */
type DispersionBoxProps = {
  children?: React.ReactNode;
  dynamic?: boolean;
  maskStart?: number;
  maskEnd?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function DispersionBox({
  children,
  dynamic = false,
  maskStart = 14,
  maskEnd = 58,
  className,
  style,
}: DispersionBoxProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const fxWrapRef = useRef<HTMLDivElement>(null);
  useCursorMask(anchorRef, [fxWrapRef], dynamic, maskStart, maskEnd);

  const mask = buildMaskCss(DEFAULT_ANGLE, maskStart, maskEnd);

  return (
    <div ref={anchorRef} style={{ position: "relative" }}>
      <div className={className} style={style}>
        {children}
      </div>
      <div
        ref={fxWrapRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: -40,
          pointerEvents: "none",
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      >
        <div
          className={className}
          style={{ ...style, position: "absolute", inset: 40, filter: "url(#nw-disperse)" }}
        />
      </div>
    </div>
  );
}
