import { Heading } from "@/app/components/atoms";
import { StageSlider } from "./StageSlider";

export function InterveningSection() {
  return (
    <section>
      <div className="pt-s5 sm:pt-s9 pb-s6 sm:pb-s12 px-page max-w-page mx-auto">
        <Heading variant="h2" className="mb-s6 sm:mb-s12">
          Intervening<br />at any stage.
        </Heading>
        <StageSlider />
      </div>
    </section>
  );
}
