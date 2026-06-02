import { StageCard } from "@/app/components/molecules/StageCard";
import type { Stage } from "@/lib/content";

type Props = { stages: Stage[] };

export function StageSlider({ stages }: Props) {
  return (
    <div className="overflow-x-auto -mx-[var(--gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="grid grid-flow-col auto-cols-[var(--spacing-pill)] gap-s1 pl-[var(--gutter)] [&>*:last-child]:mr-[var(--gutter)] snap-x snap-mandatory">
        {stages.map(({ title, desc }) => (
          <StageCard key={title} title={title} desc={desc} />
        ))}
      </div>
    </div>
  );
}
