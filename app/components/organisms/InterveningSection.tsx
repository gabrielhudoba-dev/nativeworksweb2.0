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

  const leadSpan = rest.length >= 3 ? "md:row-span-3" : "md:row-span-2";

  return (
    <section id="stages" className="-mt-s6">
      <div className="pt-s9 sm:pt-s12 max-sm:pb-s6 sm:pb-s12 px-page max-w-page mx-auto">
        <Heading variant="h2" className="mb-s6">
          {(content.intervening_title ?? "Intervening\nat any stage.").split("\n").map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </Heading>

        {/* DOM order 01→02→03 so mobile reads in stage order.
            Desktop bento preserved via explicit md:col-start / md:row-start. */}
        <div className="grid grid-cols-1 gap-s3 md:grid-cols-2">
          {rest[0] && (
            <StageCard
              key={rest[0].id}
              eyebrow={stageLabel(1)}
              title={rest[0].title}
              desc={rest[0].desc}
              className="h-full min-h-[240px] md:col-start-1 md:row-start-1"
            />
          )}
          <StageCard
            eyebrow={stageLabel(2)}
            title={lead.title}
            desc={lead.desc}
            dark
            bgImage="/images/disp3.png"
            className={`h-full min-h-[480px] md:col-start-2 md:row-start-1 max-sm:-mt-s6 ${leadSpan}`}
          />
          {rest[1] && (
            <StageCard
              key={rest[1].id}
              eyebrow={stageLabel(3)}
              title={rest[1].title}
              desc={rest[1].desc}
              className="h-full min-h-[240px] md:col-span-2"
            />
          )}
        </div>
      </div>
    </section>
  );
}
