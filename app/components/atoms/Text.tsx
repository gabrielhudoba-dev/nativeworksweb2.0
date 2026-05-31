import { createElement, HTMLAttributes } from "react";

type TextVariant = "h5" | "p0" | "p1" | "p2" | "p3" | "l1" | "l2" | "l3" | "badge";

// Baseline correction — translate-y nudges the alphabetic baseline onto the
// 24px grid (line-height puts it inside the line box / half-leading, a few px
// off the line). Opt a single element out with className="off-rhythm".
// l3 / badge stay off-grid on purpose (16px lh, UI chips, not reading flow).
const variantClass: Record<TextVariant, string> = {
  h5:    "font-body font-normal text-h5 text-prim translate-y-[4px]",
  p0:    "font-body font-normal text-p0 text-prim translate-y-[13px]",
  p1:    "font-body font-normal text-p1 text-prim translate-y-[4px]",
  p2:    "font-body font-normal text-p2 text-prim translate-y-[4px]",
  p3:    "font-body font-normal text-p3 text-prim translate-y-[5.5px]",
  l1:    "font-body font-medium text-l1 text-prim translate-y-[5.5px]",
  l2:    "font-body font-medium text-l2 text-prim translate-y-[5.5px]",
  l3:    "font-body font-normal text-l3 text-prim translate-y-[5.5px]",
  badge: "font-body font-medium text-l3 text-prim",
};

type Props = HTMLAttributes<HTMLElement> & {
  variant: TextVariant;
  as?: "p" | "span" | "div" | "label" | "li";
};

export function Text({ variant, as = "p", className = "", ...rest }: Props) {
  // translate-y only affects non-inline boxes — a span needs inline-block.
  const inlineFix = as === "span" ? "inline-block" : "";
  return createElement(as, {
    ...rest,
    className: `${variantClass[variant]} ${inlineFix} ${className}`.trim().replace(/\s+/g, " "),
  });
}
