"use client";

import Image from "next/image";
import { Avatar, Heading, Text } from "@/app/components/atoms";
import { Refer } from "./Refer";

type Props = {
  title: React.ReactNode;
  description: string;
  author?: { name: string; role: string; avatar?: string };
  showName?: boolean;
  logos?: string[];
  image?: string;
  className?: string;
};

export function PrimTextBlock({ title, description, author, showName = true, logos, image, className = "" }: Props) {
  return (
    <article className={`flex flex-col mt-s9 ${className}`}>
      <Heading variant="h4">{title}</Heading>
      <Text variant="p2">{description}</Text>
      {logos && logos.length > 0 && (
        <div className="flex items-center gap-s3 mt-s3">
          {logos.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt="" className="h-s4 w-auto grayscale shrink-0" />
          ))}
        </div>
      )}
      {author && (
        <Refer name={author.name} role={author.role} avatar={author.avatar} showName={showName} className="mt-s3" />
      )}
      {image && <Avatar src={image} alt={String(title)} size={128} className="mt-s3" />}
    </article>
  );
}
