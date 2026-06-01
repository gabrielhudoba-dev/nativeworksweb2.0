import { Heading, Text } from "@/app/components/atoms";
import { StatColumn } from "@/app/components/molecules";
import { DOT_BG } from "@/app/styles/patterns";

export function StatsSection() {
  return (
    <section style={DOT_BG}>
      <div className="pt-s5 sm:pt-s9 pb-s6 sm:pb-s12 px-page max-w-page mx-auto">
        <Heading variant="h2" className="max-w-[672px] mb-s3">
          Better products.
          <br />
          Delivered faster.
        </Heading>
        <Text variant="p2" className="mb-s9">
          Fewer steps. Higher quality. AI-accelerated.
        </Text>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-s9 sm:gap-y-0">
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
