import { Slider, SliderHandle, SliderView } from "@/app/components/molecules/Slider";
import { StageCard } from "@/app/components/molecules/StageCard";
import type { Stage } from "@/lib/content";
import type { RefObject } from "react";

type Props = {
  stages: Stage[];
  sliderRef?: RefObject<SliderHandle | null>;
  onViewChange?: (view: SliderView) => void;
};

export function StageSlider({ stages, sliderRef, onViewChange }: Props) {
  return (
    <Slider ref={sliderRef} cols={4} onViewChange={onViewChange}>
      {stages.map(({ title, desc }) => (
        <StageCard key={title} title={title} desc={desc} />
      ))}
    </Slider>
  );
}
