"use client";

import { useSquircle } from "@/app/hooks/useSquircle";

type Props = {
  src: string;
  alt: string;
  variant?: "default" | "portrait" | "fill";
  className?: string;
};

export function ImageBlock({ src, alt, variant = "default", className = "" }: Props) {
  const { ref, style } = useSquircle(21, 0.6);
  const sizeClass =
    variant === "portrait" ? "w-full aspect-[3/4]" :
                             "w-full";
  const imgClass =
    variant === "default" ? "w-full h-auto object-cover" : "w-full h-full object-cover object-center";

  return (
    <div ref={ref} style={style} className={`overflow-hidden ${sizeClass} ${className}`}>
      <img src={src} alt={alt} className={imgClass} />
    </div>
  );
}
