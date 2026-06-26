"use client";

import Image from "next/image";
import { useSquircle } from "@/app/hooks/useSquircle";

type Props = {
  src: string;
  mobileSrc?: string;
  alt: string;
  className?: string;
};

export function CaseStudyImage({ src, mobileSrc, alt, className = "" }: Props) {
  const { ref, style } = useSquircle(21, 0.6);
  return (
    <div ref={ref} style={style} className={`relative overflow-hidden h-[360px] ${className}`}>
      {mobileSrc ? (
        <>
          <Image src={mobileSrc} alt={alt} fill className="object-cover sm:hidden" sizes="100vw" />
          <Image src={src} alt={alt} fill className="object-cover hidden sm:block" sizes="50vw" />
        </>
      ) : (
        <Image src={src} alt={alt} fill className="object-cover" sizes="50vw" />
      )}
    </div>
  );
}
