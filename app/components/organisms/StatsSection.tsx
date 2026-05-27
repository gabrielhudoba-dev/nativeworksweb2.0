import { Heading, Text } from "@/app/components/atoms";
import { Attribution } from "@/app/components/molecules";

const DOT_BG = {
  backgroundImage: "radial-gradient(circle, rgba(9,14,58,0.08) 1.5px, transparent 1.5px)",
  backgroundSize: "25px 25px",
} as const;

export function StatsSection() {
  return (
    <section style={DOT_BG}>
      <div className="py-s9 px-s9 max-w-s15 mx-auto">
        <Heading variant="h2" className="max-w-[481px] mb-s6">
          Better products.
          <br />
          Delivered faster.
        </Heading>
        <Text variant="p2" className="mb-s9">
          Fewer steps. Higher quality. AI-accelerated.
        </Text>
        <div className="grid grid-cols-3">
          <div className="flex flex-col gap-s4">
            <Heading variant="numb1">2 weeks</Heading>
            <Text variant="p3" className="max-w-[260px]">Avg. time to first value</Text>
          </div>
          <div className="flex flex-col gap-s4">
            <Heading variant="numb1">33%</Heading>
            <Text variant="p3" className="max-w-[300px]">Increase in weekly active user retention in Kontentino by</Text>
            <div className="mt-s5">
              <Attribution name="Milan Tibansky" role="Growth Lead" avatar="/images/milan.png" />
            </div>
          </div>
          <div className="flex flex-col gap-s4">
            <Heading variant="numb1">8/10</Heading>
            <Text variant="p3" className="max-w-[260px]">Clients continuing after first sprint</Text>
          </div>
        </div>
      </div>
    </section>
  );
}
