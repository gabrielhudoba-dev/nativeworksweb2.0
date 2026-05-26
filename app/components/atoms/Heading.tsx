import { createElement, HTMLAttributes } from "react";

type HeadingVariant = "h2" | "h3" | "numb1";

const variantClass: Record<HeadingVariant, string> = {
  h2:    "font-display font-medium text-h2 text-prim",
  h3:    "font-display font-medium text-h3 text-prim",
  numb1: "font-display font-normal text-numb1 text-prim",
};

const defaultTagFor: Record<HeadingVariant, "h1" | "h2" | "h3" | "h4"> = {
  h2:    "h1",
  h3:    "h2",
  numb1: "h2",
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
