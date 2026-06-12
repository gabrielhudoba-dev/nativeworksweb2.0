"use client";

import { Heading, Text } from "@/app/components/atoms";
import { useSquircle } from "@/app/hooks/useSquircle";

type Props = {
  /** Eyebrow label above the title, e.g. "Stage 01". Rendered uppercase. */
  eyebrow?: string;
  title: string;
  desc: string;
  /** Dark (ink) card — white text. Used for the accent card in the bento. */
  dark?: boolean;
  /** Override sizing/placement. Defaults to the slider card height. */
  className?: string;
};

export function StageCard({ eyebrow, title, desc, dark = false, className = "h-[388px]" }: Props) {
  const { ref, style } = useSquircle(21, 0.6);

  return (
    <div
      ref={ref}
      style={style}
      className={`grain flex flex-col justify-start gap-s4 pt-s4 pb-s4 px-s3 w-full ${dark ? "bg-prim" : "bg-surface"} ${className}`}
    >
      {eyebrow && (
        <Text
          variant="p3"
          className="uppercase tracking-[0.08em] !text-[13px]"
          style={{ color: dark ? "rgba(255,255,255,0.5)" : "rgba(18,19,25,0.5)" }}
        >
          {eyebrow}
        </Text>
      )}
      <div className="flex flex-col gap-s3">
        <Heading
          variant="h4"
          className="translate-y-[12.5px]"
          style={dark ? { color: "var(--color-white)" } : undefined}
        >
          {title}
        </Heading>
        <Text variant="p2" style={dark ? { color: "rgba(255,255,255,0.6)" } : undefined}>
          {desc}
        </Text>
      </div>
    </div>
  );
}
