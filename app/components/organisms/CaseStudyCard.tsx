"use client";

import { CaseStudyImage } from "@/app/components/atoms";
import { PrimTextBlock } from "@/app/components/molecules";

export type CaseStudyCardProps = {
  variant: "left" | "right";
  image: { src: string; alt: string };
  title: React.ReactNode;
  description: string;
  author: { name: string; role: string; avatar: string };
};

export function CaseStudyCard({ variant, image, title, description, author }: CaseStudyCardProps) {
  const imageEl = <CaseStudyImage src={image.src} alt={image.alt} />;
  const contentEl = <PrimTextBlock title={title} description={description} author={author} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-s12 gap-y-s6">
      {variant === "left" ? <>{contentEl}{imageEl}</> : <>{imageEl}{contentEl}</>}
    </div>
  );
}
