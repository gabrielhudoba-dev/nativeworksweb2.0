"use client";

import { createElement, useEffect, useRef } from "react";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

type Props = {
  value: string;
  mode: "edit" | "view";
  onChange?: (value: string) => void;
  as?: Tag;
  className?: string;
  placeholder?: string;
};

/**
 * Inline-editable text. The same element renders in both edit and view mode so
 * the editor is true WYSIWYG. In edit mode it is an **uncontrolled**
 * contentEditable — the DOM owns the text, React only seeds it once on mount —
 * which avoids the cursor-jump you get when a controlled value is written back
 * on every keystroke. Parent state stays in sync via onChange.
 */
export function EditableText({ value, mode, onChange, as = "p", className = "", placeholder }: Props) {
  const ref = useRef<HTMLElement>(null);

  // Seed the DOM once on mount (and whenever we switch into edit mode).
  // innerText is used so that \n in value seeds visible line-breaks, and so
  // that reading back via innerText (in onInput) round-trips correctly.
  useEffect(() => {
    if (mode !== "edit") return;
    const el = ref.current;
    if (el && el.innerText !== value) el.innerText = value ?? "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  if (mode === "view") {
    return createElement(as, { className }, value);
  }

  return createElement(as, {
    ref,
    contentEditable: true,
    suppressContentEditableWarning: true,
    "data-placeholder": placeholder,
    spellCheck: false,
    onInput: (e: React.FormEvent<HTMLElement>) =>
      onChange?.((e.currentTarget.innerText ?? "").replace(/\n$/, "")),
    className: `editable outline-none focus:outline-none ${className}`.trim(),
  });
}
