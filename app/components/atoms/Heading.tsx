import { createElement, forwardRef, HTMLAttributes } from "react";

type HeadingVariant = "h1" | "h2" | "h3" | "h4" | "numb1" | "page";

// Baseline correction — translate-y nudges the alphabetic baseline onto the
// 24px grid (visual only; line box stays on-grid). Opt a single element out
// with className="off-rhythm".
const variantClass: Record<HeadingVariant, string> = {
  // translate-y corrections put the alphabetic baseline on the 24px grid (visual only).
  // PP Neue Montreal CSS ascent ratio = 0.859375 (82.5/96px, measured via inline baseline marker).
  // correction = nearest_24( half_leading + ascent ) − ( half_leading + ascent )
  //   where half_leading = (line-height − font-size) / 2, ascent = ratio × font-size
  h1:    "font-display font-medium text-h1 text-prim translate-y-[10.125px] max-sm:translate-y-[6.75px] lg:translate-y-[13.5px]",
  h2:    "font-display font-medium text-h2 text-prim translate-y-[6.75px] max-sm:translate-y-[11.0625px] lg:translate-y-[10.125px]",
  page:  "font-display font-medium text-hpage text-prim translate-y-[9.625px] max-sm:translate-y-[13.9375px] lg:translate-y-[15.875px]",
  h3:    "font-display font-medium text-h3 text-prim translate-y-[9.625px] max-sm:-translate-y-[0.625px]",
  h4:    "font-display font-medium text-h4 text-prim -translate-y-[10px] max-sm:translate-y-[4px]",
  numb1: "font-display font-normal text-numb1 text-prim translate-y-[11.0625px] sm:translate-y-[6.75px] lg:translate-y-[14.4375px]",
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
