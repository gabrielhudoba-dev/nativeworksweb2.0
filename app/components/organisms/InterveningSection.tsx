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
  const stageLabel = (n: number) => `${eyebrow} ${String(n).padStart(2, "0")}`;
  // Numbering follows the bento's reading order so the stages run 01 → 02 → 03
  // down the product lifecycle: top-left side card = 01, dark focal card = 02,
  // bottom-left side card = 03.
  const restNums = [1, 3];

  // Lead card spans the height of the stacked right column (both literal classes
  // kept so Tailwind detects them).
  const leadSpan = rest.length >= 3 ? "md:row-span-3" : "md:row-span-2";

  return (
    <section id="stages" className="-mt-s6">
      <div className="pt-s9 sm:pt-s12 pb-s9 sm:pb-s12 px-page max-w-page mx-auto">
        <Heading variant="h2" className="mb-s4 sm:mb-s6">
          {(content.intervening_title ?? "Intervening\nat any stage.").split("\n").map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </Heading>

        <div className="grid grid-cols-1 gap-s3 md:grid-cols-2">
          <StageCard
            eyebrow={stageLabel(2)}
            title={lead.title}
            desc={lead.desc}
            dark
            bgImage="/images/disp3.png"
            className={`h-full min-h-[488px] md:col-start-2 md:row-start-1 ${leadSpan}`}
          />
          {rest.map((s, i) => (
            <StageCard
              key={s.id}
              eyebrow={stageLabel(restNums[i] ?? i + 2)}
              title={s.title}
              desc={s.desc}
              className="h-full min-h-[240px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
