import { Heading, Text } from "@/app/components/atoms";
import { StatColumn } from "@/app/components/molecules";

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
          <StatColumn value="2 weeks" label="Avg. time to first value" />
          <StatColumn
            value="33%"
            label="Increase in weekly active user retention in Kontentino by"
            refer={{ name: "Milan Tibansky", role: "Growth Lead", avatar: "/images/milan.png" }}
          />
          <StatColumn value="8/10" label="Clients continuing after first sprint" />
        </div>
      </div>
    </section>
  );
}
