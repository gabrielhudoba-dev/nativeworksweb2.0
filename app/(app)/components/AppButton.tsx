import type { ReactNode } from "react";

/**
 * Tools-app button. Three variants:
 *   primary  — filled prim (dark), white text. Main CTAs.
 *   secondary — border only, transparent bg. Secondary actions.
 *   ghost    — no border/bg, just text. Tertiary/toolbar actions.
 *   danger   — filled error-subtle, error text. Destructive confirmations.
 *
 * Sizes:
 *   md (default) — h-s7 (56px) — form buttons
 *   sm           — h-s6 (48px) — toolbar, inline actions
 *   xs           — h-s5 (40px) — compact menus
 */

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "xs" | "sm" | "md";

const VARIANT: Record<Variant, string> = {
  primary:   "bg-prim text-white hover:opacity-85",
  secondary: "border border-prim/15 text-prim hover:border-prim/30 bg-transparent",
  ghost:     "text-prim/50 hover:text-prim hover:bg-prim/6 bg-transparent",
  danger:    "bg-error-subtle text-error hover:bg-error hover:text-white",
};

const SIZE: Record<Size, string> = {
  md: "h-s7 px-s4 text-l1 gap-s1",
  sm: "h-s6 px-s3 text-l2 gap-s1",
  xs: "h-s5 px-s2 text-l3 gap-s1",
};

type Props = {
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
};

export function AppButton({
  variant = "primary",
  size = "sm",
  type = "button",
  disabled,
  loading,
  loadingText,
  onClick,
  children,
  className = "",
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-pill font-body font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${VARIANT[variant]} ${SIZE[size]} ${className}`}
    >
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
