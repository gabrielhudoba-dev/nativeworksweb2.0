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

  return (
    <section id="stages" className="-mt-s3">
      <div className="pt-s9 sm:pt-s12 lg:pt-s18 max-sm:pb-s6 sm:pb-s12 lg:pb-s18 px-page max-w-page mx-auto">
        <Heading variant="h2" className="mb-s9 lg:mb-s12">
          {(content.intervening_title ?? "Intervening\nat any stage.").split("\n").map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </Heading>

        {/* Single column on mobile/tablet → bento at lg (1024px+).
            lg bento: lead (01) spans full height on the left (60%),
            02 and 03 stack on the right (40%). */}
        <div className="grid grid-cols-1 gap-s3 lg:grid-cols-[3fr_2fr] lg:grid-rows-2">
          <StageCard
            eyebrow={stageLabel(1)}
            title={rest[0]?.title ?? lead.title}
            desc={rest[0]?.desc ?? lead.desc}
            dark
            bgImage="/images/disp3.png"
            className="h-full min-h-[384px] lg:min-h-0 lg:col-start-1 lg:row-start-1 lg:row-span-2"
          />
          {rest[0] && (
            <StageCard
              key={rest[0].id}
              eyebrow={stageLabel(2)}
              title={lead.title}
              desc={lead.desc}
              className="h-full min-h-[192px] lg:col-start-2 lg:row-start-1"
            />
          )}
          {rest[1] && (
            <StageCard
              key={rest[1].id}
              eyebrow={stageLabel(3)}
              title={rest[1].title}
              desc={rest[1].desc}
              className="h-full min-h-[192px] lg:col-start-2 lg:row-start-2"
            />
          )}
        </div>
      </div>
    </section>
  );
}
