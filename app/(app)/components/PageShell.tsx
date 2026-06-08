import type { ReactNode } from "react";

/**
 * Page-level max-width wrapper for the tools app.
 * Three semantic widths from the token system:
 *   list   — max-w-list   (880px) — proposals index
 *   editor — max-w-editor (760px) — proposal canvas
 *   form   — max-w-form   (560px) — new proposal / verify forms
 *
 * All three are defined in globals.css @theme as --spacing-* tokens.
 */

type Width = "list" | "editor" | "form";

const WIDTH: Record<Width, string> = {
  list:   "max-w-list",
  editor: "max-w-editor",
  form:   "max-w-form",
};

type Props = {
  width?: Width;
  /** Vertical padding — defaults to py-s8 */
  py?: string;
  children: ReactNode;
  className?: string;
};

export function PageShell({ width = "list", py = "py-s8", children, className = "" }: Props) {
  return (
    <div className={`mx-auto w-full ${WIDTH[width]} px-s4 ${py} flex flex-col gap-s6 ${className}`}>
      {children}
    </div>
  );
}
