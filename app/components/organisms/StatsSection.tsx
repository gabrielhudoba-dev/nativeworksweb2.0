import { Heading, Text } from "@/app/components/atoms";
import { StatColumn } from "@/app/components/molecules";
import { DOT_BG } from "@/app/styles/patterns";
import type { SiteContent, Stat } from "@/lib/content";

type Props = { content: SiteContent; stats: Stat[] };

export function StatsSection({ content, stats }: Props) {
  return (
    <section style={DOT_BG}>
      <div className="pt-s5 sm:pt-s9 pb-s6 sm:pb-s12 px-page max-w-page mx-auto">
        <Heading variant="h2" className="max-w-[672px] mb-s3">
          {(content.stats_title ?? "Better products.\nDelivered faster.").split("\n").map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </Heading>
        <Text variant="p2" className="mb-s9">
          {content.stats_desc ?? "Fewer steps. Higher quality. AI-accelerated."}
        </Text>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-s9 sm:gap-y-0">
          {stats.map((s) => (
            <StatColumn
              key={s.id}
              value={s.value}
              label={s.label}
              refer={s.refer_name ? { name: s.refer_name, role: s.refer_role ?? "", avatar: s.refer_avatar ?? "" } : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
