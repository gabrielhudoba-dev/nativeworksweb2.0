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
  /** Decorative image blended (screen) behind the content, rotated to landscape. */
  bgImage?: string;
};

export function StageCard({ eyebrow, title, desc, dark = false, className = "h-[384px]", bgImage }: Props) {
  const { ref, style } = useSquircle(21, 0.6);

  return (
    <div
      ref={ref}
      style={style}
      className={`grain flex flex-col justify-start gap-0 p-s6 pb-s3 w-full ${dark ? "bg-black" : "bg-surface"} ${className}`}
    >
      {bgImage && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
          style={{
            // Loop sits at the card's lower edge and dissolves into the dark card
            // toward the top — its black background blends straight into bg-prim,
            // so the iridescent ring stays fully visible (no dark vignette).
            WebkitMaskImage: "linear-gradient(to top, #000 72%, transparent)",
            maskImage: "linear-gradient(to top, #000 72%, transparent)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt=""
            className="w-[588px] max-w-none object-contain translate-y-[55%]"
          />
        </div>
      )}
      <div className="flex flex-col gap-0 mt-0">
        <Heading
          variant="h4"
          style={dark ? { color: "var(--color-white)" } : undefined}
        >
          {eyebrow && <>{eyebrow.replace(/^Stage\s*/i, "")} </>}{title}
        </Heading>
        <Text variant="p2" className="pr-s3" style={dark ? { color: "rgba(255,255,255,0.6)" } : undefined}>
          {desc}
        </Text>
      </div>
    </div>
  );
}
