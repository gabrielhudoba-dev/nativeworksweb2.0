"use client";

import { useEffect, useRef, useState } from "react";
import { getSvgPath } from "figma-squircle";

export function useSquircle(cornerRadius = 21, cornerSmoothing = 0.6) {
  const ref = useRef<HTMLDivElement>(null);
  const [clipPath, setClipPath] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      const rect = el!.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const path = getSvgPath({
        width: rect.width,
        height: rect.height,
        cornerRadius,
        cornerSmoothing,
      });
      setClipPath(`path('${path}')`);
    }

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cornerRadius, cornerSmoothing]);

  return {
    ref,
    style: clipPath ? ({ clipPath, borderRadius: 0 } as React.CSSProperties) : {},
  };
}
