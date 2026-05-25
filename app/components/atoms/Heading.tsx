import { createElement, HTMLAttributes } from "react";

type HeadingVariant = "display" | "h1" | "h2" | "card" | "stat";

const variantClass: Record<HeadingVariant, string> = {
  display: "font-display font-medium text-display text-prim",
  h1: "font-display font-medium text-h1 text-fg",
  h2: "font-display font-medium text-h2 text-fg",
  card: "font-display font-medium text-card-title text-fg",
  stat: "font-display font-normal text-stat text-fg",
};

const defaultTagFor: Record<HeadingVariant, "h1" | "h2" | "h3" | "h4"> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  card: "h3",
  stat: "h2",
};

type Props = HTMLAttributes<HTMLHeadingElement> & {
  variant: HeadingVariant;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
};

export function Heading({ variant, as, className = "", ...rest }: Props) {
  const Tag = as ?? defaultTagFor[variant];
  return createElement(Tag, {
    ...rest,
    className: `${variantClass[variant]} ${className}`.trim(),
  });
}
