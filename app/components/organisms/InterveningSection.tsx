import { Heading } from "@/app/components/atoms";
import { StageSlider } from "./StageSlider";

export function InterveningSection() {
  return (
    <section>
      <div className="pt-s9 pb-s12 px-s11 max-w-page mx-auto">
        <Heading variant="h2" className="mb-s12">
          Intervening<br />at any stage.
        </Heading>
        <StageSlider />
      </div>
    </section>
  );
}
