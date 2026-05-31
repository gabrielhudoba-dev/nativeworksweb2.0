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
      className="grain bg-surface flex flex-col justify-end gap-s3 pt-s3 pb-s6 px-s3 w-pill h-[288px] snap-start shrink-0"
    >
      <Heading variant="h3" className="translate-y-[12.5px]">{title}</Heading>
      <Text variant="p2">{desc}</Text>
    </div>
  );
}
