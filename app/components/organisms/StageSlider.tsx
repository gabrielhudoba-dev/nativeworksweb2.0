import { StageCard } from "@/app/components/molecules/StageCard";

const CARDS = [
  { title: "Early Product", desc: "Building from the ground up, with quality from day one" },
  { title: "Scaling Product", desc: "New features, growing complexity, need for structure" },
  { title: "Capacity Gaps", desc: "Internal team can't keep up with speed or scope" },
  { title: "Competitive Pressure", desc: "Market moves faster than the product" },
];

export function StageSlider() {
  return (
    <div className="overflow-x-auto -mx-s9 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="grid grid-flow-col auto-cols-[300px] gap-s4 px-s9 snap-x snap-mandatory">
        {CARDS.map(({ title, desc }) => (
          <StageCard key={title} title={title} desc={desc} />
        ))}
      </div>
    </div>
  );
}
