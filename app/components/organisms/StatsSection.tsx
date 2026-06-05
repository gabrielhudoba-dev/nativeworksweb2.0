"use client";

import { Heading, Text } from "@/app/components/atoms";
import { StatsSlider } from "@/app/components/molecules";
import { useSliderSection } from "@/app/hooks/useSliderSection";
import { DOT_BG } from "@/app/styles/patterns";
import type { SiteContent, Stat } from "@/lib/content";

type Props = { content: SiteContent; stats: Stat[] };

export function StatsSection({ content, stats }: Props) {
  const { sliderRef, containerRef, onViewChange } = useSliderSection("stats-slider", stats.length);

  return (
    <section style={DOT_BG}>
      <div className="pt-s7 sm:pt-s9 pb-s9 sm:pb-s12">
        <div className="px-page max-w-page mx-auto mb-s9">
          <Heading variant="h2" className="max-w-[672px] mb-s3">
            {(content.stats_title ?? "Better products.\nDelivered faster.").split("\n").map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </Heading>
          <Text variant="p2">
            {content.stats_desc ?? "Fewer steps. Higher quality. AI-accelerated."}
          </Text>
        </div>

        <div ref={containerRef} className="px-page max-w-page mx-auto">
          <StatsSlider stats={stats} sliderRef={sliderRef} onViewChange={onViewChange} containerClassName="py-s3 -my-s3" />
        </div>
      </div>
    </section>
  );
}
