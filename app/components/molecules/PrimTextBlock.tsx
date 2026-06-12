"use client";

import Image from "next/image";
import { Avatar, Heading, Text } from "@/app/components/atoms";
import { Refer } from "./Refer";

type Author = { name: string; role: string; avatar?: string };

type Props = {
  title: React.ReactNode;
  description: string;
  author?: Author;
  /** Multiple authors, rendered side by side. Takes precedence over `author`. */
  authors?: Author[];
  showName?: boolean;
  logos?: string[];
  image?: string;
  className?: string;
};

/** Wrap trademark service names (e.g. "Problem Solving Sprint™") in medium weight. */
function emphasizeTrademarks(text: string): React.ReactNode[] {
  return text.split(/([A-Z][A-Za-z]*(?:\s+[A-Z][A-Za-z]*)*™)/g).map((part, i) =>
    part.endsWith("™") ? <span key={i} className="font-medium">{part}</span> : part
  );
}

export function PrimTextBlock({ title, description, author, authors, showName = true, logos, image, className = "" }: Props) {
  const people = authors && authors.length > 0 ? authors : author ? [author] : [];
  return (
    <article className={`flex flex-col mt-s9 ${className}`}>
      <Heading variant="h3" style={{ fontSize: "40px" }}>{title}</Heading>
      <Text variant="p2">{emphasizeTrademarks(description)}</Text>
      {logos && logos.length > 0 && (
        <div className="flex items-center gap-s3 mt-s3">
          {logos.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt="" className="h-s4 w-auto grayscale shrink-0" />
          ))}
        </div>
      )}
      {people.length > 0 && (
        <div className="flex flex-wrap items-start gap-x-s9 gap-y-s4 mt-s3">
          {people.map((p, i) => (
            <Refer key={i} name={p.name} role={p.role} avatar={p.avatar} showName={showName} />
          ))}
        </div>
      )}
      {image && <Avatar src={image} alt={String(title)} size={128} className="mt-s3" />}
    </article>
  );
}
