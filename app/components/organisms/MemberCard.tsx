"use client";

import { useEffect, useState } from "react";
import { Avatar, Heading, Text } from "@/app/components/atoms";

type Props = {
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  logos?: string[];
  className?: string;
};

function LogoCycler({ logos }: { logos: string[] }) {
  const fixed = logos.slice(0, 2);
  const cycling = logos.slice(2);
  const [cycleIdx, setCycleIdx] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    if (cycling.length <= 1) return;
    const id = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCycleIdx((i) => (i + 1) % cycling.length);
        setFadeIn(true);
      }, 300);
    }, 10000);
    return () => clearInterval(id);
  }, [cycling.length]);

  return (
    <div className="flex items-center gap-s5 mt-s3 h-[48px]">
      {fixed.map((src, i) => (
        <img key={i} src={src} alt="" className="h-s4 w-auto grayscale opacity-20 shrink-0" />
      ))}
      {cycling.length > 0 && (
        <img
          key={cycleIdx}
          src={cycling[cycleIdx]}
          alt=""
          className="h-s4 w-auto grayscale shrink-0"
          style={{ opacity: fadeIn ? 0.2 : 0, transition: "opacity var(--duration-base) var(--ease-system)" }}
        />
      )}
    </div>
  );
}

export function MemberCard({ name, role, bio, avatar, logos, className = "" }: Props) {
  return (
    <article className={`flex flex-col ${className}`}>
      {avatar ? (
        <Avatar src={avatar} alt={name} size={72} className="shrink-0 -mt-s3 mb-s3" />
      ) : (
        <span className="size-s9 rounded-pill bg-surface shrink-0 inline-block -mt-s3 mb-s3" />
      )}
      <Heading variant="h4">{name}</Heading>
      <Text variant="p2" as="span" className="-mt-s3">{role}</Text>
      <Text variant="p2" className="mt-s3">{bio}</Text>
      {logos && logos.length > 0 && <LogoCycler logos={logos} />}
    </article>
  );
}
