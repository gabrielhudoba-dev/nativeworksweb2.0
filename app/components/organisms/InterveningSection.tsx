import { Heading } from "@/app/components/atoms";
import { StageCard } from "@/app/components/molecules/StageCard";
import type { SiteContent, Stage } from "@/lib/content";

type Props = { content: SiteContent; stages: Stage[] };

/**
 * Process bento (wireframe layout): a tall lead card on the left spanning the
 * full height, the remaining stages stacked on the right — last one dark.
 */
export function InterveningSection({ content, stages }: Props) {
  const [lead, ...rest] = stages;
  if (!lead) return null;

  const eyebrow = content.intervening_eyebrow ?? "Stage";
  const stageLabel = (i: number) => `${eyebrow} ${String(i + 1).padStart(2, "0")}`;

  // Lead card spans the height of the stacked right column (both literal classes
  // kept so Tailwind detects them).
  const leadSpan = rest.length >= 3 ? "md:row-span-3" : "md:row-span-2";

  return (
    <section id="stages" className="-mt-s6">
      <div className="pt-s12 sm:pt-s15 pb-s9 sm:pb-s12 px-page max-w-page mx-auto">
        <Heading variant="h2" className="mb-s6 sm:mb-s9">
          {(content.intervening_title ?? "Intervening\nat any stage.").split("\n").map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </Heading>

        <div className="grid grid-cols-1 gap-s1 md:grid-cols-2">
          <StageCard
            eyebrow={stageLabel(0)}
            title={lead.title}
            desc={lead.desc}
            className={`h-full min-h-[488px] ${leadSpan}`}
          />
          {rest.map((s, i) => (
            <StageCard
              key={s.id}
              eyebrow={stageLabel(i + 1)}
              title={s.title}
              desc={s.desc}
              dark={i === rest.length - 1}
              className="h-full min-h-[240px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
