import type { ComponentType, SVGProps } from "react";
import type { IconProps as PhosphorIconProps, IconWeight } from "@phosphor-icons/react";
import {
  ArrowRight,
  ArrowSquareOut,
  BracketsCurly,
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  CheckCircle,
  Copy,
  DotsThreeVertical,
  Eye,
  FileText,
  Image,
  Link,
  MagnifyingGlass,
  Microscope,
  PaperPlaneRight,
  PencilSimple,
  PersonSimpleRun,
  Plus,
  ShareNetwork,
  TextT,
  Trash,
  UploadSimple,
  Warning,
  X,
} from "@phosphor-icons/react/ssr";

type SvgProps = SVGProps<SVGSVGElement>;

function ChevronLeft({ className, role, "aria-label": ariaLabel, "aria-hidden": ariaHidden }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} role={role} aria-label={ariaLabel} aria-hidden={ariaHidden}>
      <path d="M13.8 18L7.8 12L13.8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight({ className, role, "aria-label": ariaLabel, "aria-hidden": ariaHidden }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} role={role} aria-label={ariaLabel} aria-hidden={ariaHidden}>
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown({ className, role, "aria-label": ariaLabel, "aria-hidden": ariaHidden }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} role={role} aria-label={ariaLabel} aria-hidden={ariaHidden}>
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QuestionMark({ className, role, "aria-label": ariaLabel, "aria-hidden": ariaHidden }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} role={role} aria-label={ariaLabel} aria-hidden={ariaHidden}>
      <path d="M9 9C9 6.79 10.79 5 13 5C15.21 5 17 6.79 17 9C17 10.5 16.17 11.79 14.95 12.49C13.94 13.1 13 13.97 13 15.17V15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="13" cy="19" r="1" fill="currentColor"/>
    </svg>
  );
}

function ArrowsMove({ className, role, "aria-label": ariaLabel, "aria-hidden": ariaHidden }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} role={role} aria-label={ariaLabel} aria-hidden={ariaHidden}>
      <path d="M12 4L9 8H11V11H13V8H15L12 4Z" fill="currentColor" />
      <path d="M12 20L9 16H11V13H13V16H15L12 20Z" fill="currentColor" />
      <path d="M4 12L8 9V11H11V13H8V15L4 12Z" fill="currentColor" />
      <path d="M20 12L16 9V11H13V13H16V15L20 12Z" fill="currentColor" />
    </svg>
  );
}

function Menu({ className, role, "aria-label": ariaLabel, "aria-hidden": ariaHidden }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} role={role} aria-label={ariaLabel} aria-hidden={ariaHidden}>
      <path d="M4 7H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const registry: Record<string, ComponentType<PhosphorIconProps | SvgProps>> = {
  "arrow-right":       ArrowRight,
  "arrows-move":       ArrowsMove,
  "arrow-square-out":  ArrowSquareOut,
  "brackets-curly":    BracketsCurly,
  calendar:            CalendarBlank,
  "caret-down":        CaretDown,
  "caret-left":        CaretLeft,
  "caret-right":       CaretRight,
  check:               Check,
  "check-circle":      CheckCircle,
  close:               X,
  copy:                Copy,
  "chevron-down":      ChevronDown,
  "chevron-left":      ChevronLeft,
  "chevron-right":     ChevronRight,
  "dots-three-vertical": DotsThreeVertical,
  eye:                 Eye,
  "file-text":         FileText,
  image:               Image,
  link:                Link,
  "magnifying-glass":  MagnifyingGlass,
  menu:                Menu,
  microscope:          Microscope,
  "paper-plane":       PaperPlaneRight,
  "pencil-simple":     PencilSimple,
  "person-simple-run": PersonSimpleRun,
  plus:                Plus,
  question:            QuestionMark,
  share:               ShareNetwork,
  "text-t":            TextT,
  trash:               Trash,
  upload:              UploadSimple,
  warning:             Warning,
};

export type IconName = keyof typeof registry;

type IconSize = "xs" | "sm" | "md" | "lg";

const sizeClass: Record<IconSize, string> = {
  xs: "size-[12px]",
  sm: "size-s2",
  md: "size-s3",
  lg: "size-s4",
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
