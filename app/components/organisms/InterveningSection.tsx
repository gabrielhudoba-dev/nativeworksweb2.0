import { Heading } from "@/app/components/atoms";
import { StageSlider } from "./StageSlider";

const DOT_BG = {
  backgroundImage: "radial-gradient(circle, rgba(9,14,58,0.08) 1.5px, transparent 1.5px)",
  backgroundSize: "25px 25px",
} as const;

export function InterveningSection() {
  return (
    <section style={DOT_BG}>
      <div className="py-s9 px-s9 max-w-s15 mx-auto">
        <Heading variant="h2" className="mb-s8">
          Intervening<br />at any stage.
        </Heading>
        <StageSlider />
      </div>
    </section>
  );
}
