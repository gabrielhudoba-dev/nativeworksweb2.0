import { Heading } from "@/app/components/atoms";
import { StageSlider } from "./StageSlider";
import type { SiteContent, Stage } from "@/lib/content";

type Props = { content: SiteContent; stages: Stage[] };

export function InterveningSection({ content, stages }: Props) {
  return (
    <section>
      <div className="pt-s5 sm:pt-s9 pb-s6 sm:pb-s12 px-page max-w-page mx-auto">
        <Heading variant="h2" className="mb-s6 sm:mb-s12">
          {(content.intervening_title ?? "Intervening\nat any stage.").split("\n").map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </Heading>
        <StageSlider stages={stages} />
      </div>
    </section>
  );
}
