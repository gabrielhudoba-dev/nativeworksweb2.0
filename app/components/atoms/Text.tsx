import { createElement, HTMLAttributes } from "react";

type TextVariant =
  | "body"
  | "eyebrow"
  | "bullet-label"
  | "bullet-desc"
  | "meta"
  | "meta-sm"
  | "price"
  | "price-regular"
  | "cta"
  | "badge";

const variantClass: Record<TextVariant, string> = {
  body: "font-body font-normal text-body text-fg",
  eyebrow: "font-body font-normal text-body text-fg",
  "bullet-label": "font-body font-medium text-body text-fg",
  "bullet-desc": "font-body font-normal text-body text-fg",
  meta: "font-body font-medium text-meta text-fg",
  "meta-sm": "font-body font-normal text-meta-sm text-fg",
  price: "font-display font-medium text-price text-fg",
  "price-regular": "font-display font-normal text-price text-fg",
  cta: "font-body font-normal text-cta",
  badge: "font-body font-bold text-badge",
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
