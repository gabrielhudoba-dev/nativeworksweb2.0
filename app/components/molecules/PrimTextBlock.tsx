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
  /** Two-column layout: title in column 1, description + authors in column 2
   *  (column 2 aligns with the right column of a grid-cols-2 gap-x-s8 row below). */
  split?: boolean;
  className?: string;
};

/** Wrap trademark service names (e.g. "Problem Solving Sprint™") in medium weight. */
function emphasizeTrademarks(text: string): React.ReactNode[] {
  return text.split(/([A-Z][A-Za-z]*(?:\s+[A-Z][A-Za-z]*)*™)/g).map((part, i) =>
    part.endsWith("™") ? <span key={i} className="font-medium">{part}</span> : part
  );
}

export function PrimTextBlock({ title, description, author, authors, showName = true, logos, image, split = false, className = "" }: Props) {
  const people = authors && authors.length > 0 ? authors : author ? [author] : [];

  const heading = <Heading variant="h3">{title}</Heading>;
  const body = (
    <>
      <Text variant="p2" className="mt-s3 max-sm:pr-s2">{emphasizeTrademarks(description)}</Text>
      {logos && logos.length > 0 && (
        <div className="flex items-center gap-s3 mt-s3">
          {logos.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt="" className="h-s4 w-auto grayscale shrink-0" />
          ))}
        </div>
      )}
      {people.length > 0 && (
        <div className="flex flex-wrap items-start gap-x-s4 gap-y-s3 sm:gap-x-s6 mt-s3">
          {people.map((p, i) => (
            <Refer key={i} name={p.name} role={p.role} avatar={p.avatar} showName={showName} />
          ))}
        </div>
      )}
      {image && <Avatar src={image} alt={String(title)} size={128} className="mt-s3" />}
    </>
  );

  if (split) {
    return (
      <article className={`grid grid-cols-1 sm:grid-cols-2 gap-x-s8 max-sm:gap-y-s3 sm:gap-y-s6 max-sm:mt-s3 sm:mt-s9 ${className}`}>
        {heading}
        <div className="flex flex-col">{body}</div>
      </article>
    );
  }

  return (
    <article className={`flex flex-col max-sm:mt-s3 sm:mt-s9 ${className}`}>
      {heading}
      {body}
    </article>
  );
}
