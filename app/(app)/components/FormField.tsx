"use client";

import type { ReactNode } from "react";

/**
 * Shared form field primitives for the tools app.
 * Every input in the builder (NewProposalForm, ShareButton email tab, etc.)
 * uses these so font-size, border-radius, padding, and focus ring are consistent.
 *
 * Label is always visible above the input (no floating labels).
 * Required indicator (*) is appended to the label text automatically.
 */

const INPUT_BASE =
  "w-full bg-white font-body text-prim outline-none border border-prim/15 rounded-md transition-colors focus:border-brand placeholder:text-prim/35";

// ─── Field wrapper (label + input + optional hint/error) ──────────────────────

type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

export function Field({ label, required, hint, error, children, className = "" }: FieldProps) {
  return (
    <label className={`flex flex-col gap-s1 ${className}`}>
      <span className="font-body text-l3 text-prim/55">
        {label}
        {required && <span className="text-error ml-[3px]">*</span>}
      </span>
      {children}
      {hint && !error && (
        <span className="font-body text-l3 text-prim/35">{hint}</span>
      )}
      {error && (
        <span className="font-body text-l3 text-error">{error}</span>
      )}
    </label>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

type InputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  size?: "sm" | "md";
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const INPUT_SIZE = { sm: "h-s6 px-s2 text-l2", md: "h-s7 px-s3 text-p3" };

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus,
  readOnly,
  size = "md",
  onFocus,
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      readOnly={readOnly}
      onFocus={onFocus}
      className={`${INPUT_BASE} ${INPUT_SIZE[size]}`}
    />
  );
}

// ─── Textarea ────────────────────────────────────────────────────────────────

type TextareaProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
};

export function Textarea({ value, onChange, placeholder, rows = 5 }: TextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`${INPUT_BASE} px-s2 py-s1 text-l2 resize-none leading-relaxed`}
    />
  );
}
