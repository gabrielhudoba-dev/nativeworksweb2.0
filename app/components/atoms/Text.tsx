import { createElement, HTMLAttributes } from "react";

type TextVariant = "h5" | "p1" | "p2" | "p3" | "l1" | "l2" | "l3" | "badge";

const variantClass: Record<TextVariant, string> = {
  h5:    "font-body font-normal text-h5 text-prim",
  p1:    "font-body font-normal text-p1 text-prim",
  p2:    "font-body font-normal text-p2 text-prim",
  p3:    "font-body font-normal text-p3 text-prim",
  l1:    "font-body font-medium text-l1 text-prim",
  l2:    "font-body font-medium text-l2 text-prim",
  l3:    "font-body font-normal text-l3 text-prim",
  badge: "font-body font-medium text-l3 text-prim",
};

type Props = HTMLAttributes<HTMLElement> & {
  variant: TextVariant;
  as?: "p" | "span" | "div" | "label" | "li";
};

export function Text({ variant, as = "p", className = "", ...rest }: Props) {
  return createElement(as, {
    ...rest,
    className: `${variantClass[variant]} ${className}`.trim(),
  });
}
