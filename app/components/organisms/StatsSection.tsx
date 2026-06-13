"use client";

import { Heading } from "@/app/components/atoms";
import { StatColumn, StatsSlider } from "@/app/components/molecules";
import { useSliderSection } from "@/app/hooks/useSliderSection";
import { DOT_BG } from "@/app/styles/patterns";
import type { SiteContent, Stat } from "@/lib/content";

type Props = { content: SiteContent; stats: Stat[] };

/** Stats: static 3-col grid on desktop, swipeable carousel on mobile/tablet. */
export function StatsSection({ content, stats }: Props) {
  const { sliderRef, containerRef, onViewChange } = useSliderSection("stats-slider", stats.length);

  const cells = stats.map((s) => ({
    s,
    refer: s.refer_name
      ? { name: s.refer_name, role: s.refer_role ?? "", avatar: s.refer_avatar ?? "" }
      : undefined,
  }));

  return (
    <section style={DOT_BG}>
      <div className="pt-s9 pb-s9 sm:pb-s12">
        <div className="px-page max-w-page mx-auto mb-s9">
          <Heading variant="h2" className="max-w-[672px]">
            {(content.stats_title ?? "Better products.\nDelivered faster.").split("\n").map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </Heading>
        </div>

        {/* Mobile / tablet: swipeable carousel (one card per row, peek of the next) */}
        <div ref={containerRef} className="lg:hidden px-page max-w-page mx-auto">
          <StatsSlider
            stats={stats}
            sliderRef={sliderRef}
            onViewChange={onViewChange}
            containerClassName="py-s3 -my-s3"
          />
        </div>

        {/* Desktop: static 3-col grid */}
        <div className="hidden lg:grid px-page max-w-page mx-auto grid-cols-3 gap-x-s4 gap-y-s9">
          {cells.map(({ s, refer }) => (
            <StatColumn key={s.id} value={s.value} label={s.label} refer={refer} />
          ))}
        </div>
      </div>
    </section>
  );
}
