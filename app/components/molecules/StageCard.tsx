"use client";

import { Heading, Text } from "@/app/components/atoms";
import { useSquircle } from "@/app/hooks/useSquircle";

type Props = {
  title: string;
  desc: string;
};

export function StageCard({ title, desc }: Props) {
  const { ref, style } = useSquircle(21, 0.6);

  return (
    <div
      ref={ref}
      style={style}
      className="grain bg-surface flex flex-col justify-end gap-s6 pt-s6 pb-s8 px-s6 w-[300px] h-[300px] snap-start shrink-0"
    >
      <Heading variant="h3">{title}</Heading>
      <Text variant="p3">{desc}</Text>
    </div>
  );
}
