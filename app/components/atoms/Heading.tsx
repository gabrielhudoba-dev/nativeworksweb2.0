import { createElement, forwardRef, HTMLAttributes } from "react";

type HeadingVariant = "h1" | "h2" | "h3" | "h4" | "numb1" | "page";

// Baseline correction — translate-y nudges the alphabetic baseline onto the
// 24px grid (visual only; line box stays on-grid). Opt a single element out
// with className="off-rhythm".
const variantClass: Record<HeadingVariant, string> = {
  // translate-y corrections put the alphabetic baseline on the 24px grid (visual only).
  // Values per breakpoint are derived from PP Neue Montreal ascent ratio ≈ 0.78:
  //   correction = lh − (half_leading + 0.78 × font_size)
  // where the result targets the nearest grid line below the layout box top.
  h1:    "font-display font-medium text-h1 text-prim translate-y-[15.75px] max-sm:translate-y-[10.5px] lg:translate-y-[21px]",
  h2:    "font-display font-medium text-h2 text-prim translate-y-[10.5px] max-sm:translate-y-[14px] lg:translate-y-[16px]",
  page:  "font-display font-medium text-hpage text-prim -translate-y-[8px]",
  h3:    "font-display font-medium text-h3 text-prim -translate-y-[11.5px] max-sm:translate-y-[1px]",
  h4:    "font-display font-medium text-h4 text-prim -translate-y-[10px] max-sm:translate-y-[6px]",
  numb1: "font-display font-normal text-numb1 text-prim -translate-y-[9.5px] sm:translate-y-[10.5px] lg:translate-y-[19px]",
};

const defaultTagFor: Record<HeadingVariant, "h1" | "h2" | "h3" | "h4"> = {
  h1:    "h1",
  h2:    "h1",
  page:  "h1",
  h3:    "h2",
  h4:    "h3",
  numb1: "h2",
};

type Props = HTMLAttributes<HTMLHeadingElement> & {
  variant: HeadingVariant;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span";
};

export const Heading = forwardRef<HTMLHeadingElement, Props>(
  function Heading({ variant, as, className = "", ...rest }, ref) {
    const Tag = as ?? defaultTagFor[variant];
    const inlineFix = as === "span" ? "inline-block" : "";
    return createElement(Tag, {
      ...rest,
      ref,
      className: `${variantClass[variant]} ${inlineFix} ${className}`.trim().replace(/\s+/g, " "),
    });
  }
);
