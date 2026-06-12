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

export function StageCard({ eyebrow, title, desc, dark = false, className = "h-[388px]", bgImage }: Props) {
  const { ref, style } = useSquircle(21, 0.6);

  return (
    <div
      ref={ref}
      style={style}
      className={`grain flex flex-col justify-start gap-0 pt-s4 pb-s4 pl-s3 pr-s10 w-full ${dark ? "bg-prim" : "bg-surface"} ${className}`}
    >
      {bgImage && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-135px] left-1/2 h-[270px] w-[473px] -translate-x-1/2"
          style={{
            // Radial mask dissolves the image's black rectangular edges into the
            // card so only the central sphere shows — `.grain`'s isolation breaks
            // the screen blend's composite against bg-prim, so we fade via alpha.
            WebkitMaskImage:
              "radial-gradient(ellipse 46% 72% at 50% 50%, #000 34%, transparent 74%)",
            maskImage:
              "radial-gradient(ellipse 46% 72% at 50% 50%, #000 34%, transparent 74%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt=""
            className="absolute left-1/2 top-1/2 h-[270px] w-[473px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </div>
      )}
      {eyebrow && (
        <Text
          variant="p3"
          className="uppercase tracking-[0.08em] !text-[13px] !leading-none"
          style={{ color: dark ? "rgba(255,255,255,0.5)" : "rgba(18,19,25,0.5)" }}
        >
          {eyebrow}
        </Text>
      )}
      <div className="flex flex-col gap-s2">
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
