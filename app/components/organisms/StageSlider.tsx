import { StageCard } from "@/app/components/molecules/StageCard";
import type { Stage } from "@/lib/content";

type Props = { stages: Stage[] };

export function StageSlider({ stages }: Props) {
  return (
    <div className="overflow-x-auto lg:overflow-visible -mx-[var(--gutter)] lg:mx-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="grid grid-flow-col auto-cols-[var(--spacing-pill)] lg:grid-flow-row lg:grid-cols-4 gap-s1 pl-[var(--gutter)] lg:pl-0 [&>*:last-child]:mr-[var(--gutter)] lg:[&>*:last-child]:mr-0 snap-x snap-mandatory lg:snap-none">
        {stages.map(({ title, desc }) => (
          <StageCard key={title} title={title} desc={desc} />
        ))}
      </div>
    </div>
  );
}
