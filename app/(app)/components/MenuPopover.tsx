"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Reusable dropdown/popover container for the tools app.
 * Handles: backdrop dismiss, Escape key, pointer-down outside.
 *
 * Usage:
 *   <MenuPopover open={open} onClose={() => setOpen(false)} align="right">
 *     <MenuItem icon={<Icon name="trash" />} label="Delete" onClick={...} danger />
 *   </MenuPopover>
 *
 * The trigger button is NOT included — caller renders it and sets `open`.
 */

type PopoverProps = {
  open: boolean;
  onClose: () => void;
  align?: "left" | "right";
  width?: string;
  children: ReactNode;
};

export function MenuPopover({
  open,
  onClose,
  align = "right",
  width = "w-52",
  children,
}: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`absolute top-full mt-s1 ${align === "right" ? "right-0" : "left-0"} ${width} bg-white border border-prim/10 rounded-lg shadow-elevated overflow-hidden z-30`}
    >
      {children}
    </div>
  );
}

// ─── MenuItem ─────────────────────────────────────────────────────────────────

type MenuItemProps = {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
  confirming?: boolean;
  disabled?: boolean;
};

export function MenuItem({ label, onClick, icon, danger, confirming, disabled }: MenuItemProps) {
  const base = "flex items-center gap-s2 w-full text-left px-s3 py-s2 font-body text-l2 transition-colors disabled:opacity-40";
  const color = danger
    ? confirming
      ? "text-error bg-error-subtle hover:bg-error hover:text-white"
      : "text-error hover:bg-error-subtle"
    : "text-prim hover:bg-surface";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${color}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </button>
  );
}
