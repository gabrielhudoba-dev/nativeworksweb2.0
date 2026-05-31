"use client";

import Image from "next/image";
import { useSquircle } from "@/app/hooks/useSquircle";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export function CaseStudyImage({ src, alt, className = "" }: Props) {
  const { ref, style } = useSquircle(21, 0.6);
  return (
    <div ref={ref} style={style} className={`relative overflow-hidden h-[360px] ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="50vw" />
    </div>
  );
}
