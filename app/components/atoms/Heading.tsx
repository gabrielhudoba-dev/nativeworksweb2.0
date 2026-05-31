import { createElement, HTMLAttributes } from "react";

type HeadingVariant = "h2" | "h3" | "h4" | "numb1" | "page";

// Baseline correction — translate-y nudges the alphabetic baseline onto the
// 24px grid (visual only; line box stays on-grid). Opt a single element out
// with className="off-rhythm".
const variantClass: Record<HeadingVariant, string> = {
  h2:    "font-display font-medium text-h2 text-prim translate-y-[10.5px]",
  page:  "font-display font-medium text-hpage text-prim -translate-y-[8px]",
  h3:    "font-display font-medium text-h3 text-prim -translate-y-[11.5px]",
  h4:    "font-display font-medium text-h4 text-prim -translate-y-[10px]",
  numb1: "font-display font-normal text-numb1 text-prim -translate-y-[9.5px]",
};

const defaultTagFor: Record<HeadingVariant, "h1" | "h2" | "h3" | "h4"> = {
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

export function Heading({ variant, as, className = "", ...rest }: Props) {
  const Tag = as ?? defaultTagFor[variant];
  const inlineFix = as === "span" ? "inline-block" : "";
  return createElement(Tag, {
    ...rest,
    className: `${variantClass[variant]} ${inlineFix} ${className}`.trim().replace(/\s+/g, " "),
  });
}
