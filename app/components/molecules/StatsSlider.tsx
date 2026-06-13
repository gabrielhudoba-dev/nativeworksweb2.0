import { Slider, SliderHandle, SliderView } from "./Slider";
import { StatColumn } from "./StatColumn";
import type { Stat } from "@/lib/content";
import type { RefObject } from "react";

type Props = {
  stats: Stat[];
  sliderRef?: RefObject<SliderHandle | null>;
  onViewChange?: (view: SliderView) => void;
  containerClassName?: string;
};

export function StatsSlider({ stats, sliderRef, onViewChange, containerClassName }: Props) {
  return (
    <Slider ref={sliderRef} cols={3} onViewChange={onViewChange} containerClassName={containerClassName}>
      {[...stats].reverse().map((s) => (
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
    </Slider>
  );
}
