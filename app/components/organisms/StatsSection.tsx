import { Heading, Text } from "@/app/components/atoms";
import { StatColumn } from "@/app/components/molecules";
import { DOT_BG } from "@/app/styles/patterns";
import type { SiteContent, Stat } from "@/lib/content";

type Props = { content: SiteContent; stats: Stat[] };

/** Stats as a static grid — 3 per row (no slider). */
export function StatsSection({ content, stats }: Props) {
  return (
    <section style={DOT_BG}>
      <div className="pt-s7 sm:pt-s9 pb-s9 sm:pb-s12">
        <div className="px-page max-w-page mx-auto mb-s9">
          <Heading variant="h2" className="max-w-[672px] mb-s3">
            {(content.stats_title ?? "Better products.\nDelivered faster.").split("\n").map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </Heading>
          <Text variant="p1">
            {content.stats_desc ?? "Fewer steps. Higher quality. AI-accelerated."}
          </Text>
        </div>

        <div className="px-page max-w-page mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-s4 gap-y-s9">
          {stats.map((s) => (
            <StatColumn
              key={s.id}
              value={s.value}
              label={s.label}
              refer={
                s.refer_name
                  ? { name: s.refer_name, role: s.refer_role ?? "", avatar: s.refer_avatar ?? "" }
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
