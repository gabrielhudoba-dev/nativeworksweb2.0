import type { ComponentType } from "react";
import type { IconProps as PhosphorIconProps, IconWeight } from "@phosphor-icons/react";
import {
  ArrowRight,
  BracketsCurly,
  CaretLeft,
  CaretRight,
  Check,
  Copy,
  Microscope,
  PersonSimpleRun,
} from "@phosphor-icons/react/ssr";

const registry: Record<string, ComponentType<PhosphorIconProps>> = {
  "arrow-right": ArrowRight,
  "brackets-curly": BracketsCurly,
  "caret-left": CaretLeft,
  "caret-right": CaretRight,
  check: Check,
  copy: Copy,
  microscope: Microscope,
  "person-simple-run": PersonSimpleRun,
};

export type IconName = keyof typeof registry;

type IconSize = "sm" | "md" | "lg";

const sizeClass: Record<IconSize, string> = {
  sm: "size-16",
  md: "size-24",
  lg: "size-32",
};

type Props = {
  name: IconName;
  size?: IconSize;
  weight?: IconWeight;
  title?: string;
  className?: string;
};

export function Icon({ name, size = "md", weight = "regular", title, className = "" }: Props) {
  const Component = registry[name];
  return (
    <Component
      weight={weight}
      className={`shrink-0 ${sizeClass[size]} ${className}`.trim()}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    />
  );
}
