"use client";

import { Heading, ImageBlock, Text } from "@/app/components/atoms";
import { Refer, StatColumn } from "@/app/components/molecules";
import { CaseStudyCard } from "@/app/components/organisms";
import { DOT_BG } from "@/app/styles/patterns";

type CaseStudyItem = {
  type: "case-study";
  variant: "left" | "right";
  image: { src: string; alt: string };
  title: React.ReactNode;
  description: string;
  author: { name: string; role: string; avatar: string };
};
type StatsItem = {
  type: "stats";
  stats: Array<{ value: string; label: string }>;
};
type TextItem = {
  type: "text";
  title: React.ReactNode;
  description: string;
  author: { name: string; role: string; avatar: string };
};
type ImageItem = { type: "image"; src: string; alt: string };
type GridItem = CaseStudyItem | StatsItem | TextItem | ImageItem;

const GRID_ITEMS: GridItem[] = [
  {
    type: "case-study",
    variant: "right",
    image: { src: "/images/sline01.png", alt: "Notion AI case study" },
    title: "Notion AI",
    description:
      "AI features increased complexity. Users did not understand where to start or how the product worked. Core workflows became fragmented.",
    author: { name: "Martin Novák", role: "Lead Designer", avatar: "/images/martin.png" },
  },
  {
    type: "stats",
    stats: [
      { value: "3×", label: "Reduction in time-to-first-value after onboarding redesign" },
      { value: "40%", label: "Increase in AI feature discoverability across core workflows" },
      { value: "4.7/5", label: "Post-redesign user satisfaction score" },
      { value: "2×", label: "Increase in feature adoption within first week" },
      { value: "60%", label: "Drop in support tickets related to onboarding confusion" },
    ],
  },
  {
    type: "image",
    src: "/images/sline01.png",
    alt: "Notion AI product showcase",
  },
  {
    type: "case-study",
    variant: "left",
    image: { src: "/images/sline02.png", alt: "Coinbase Advanced Trade case study" },
    title: (
      <>
        Coinbase
        <br />
        Advanced Trade
      </>
    ),
    description:
      "The platform was powerful but overwhelming. Advanced features reduced usability and conversion. New users dropped before first trade.",
    author: { name: "Milan Horváth", role: "Lead Designer", avatar: "/images/milan.png" },
  },
  {
    type: "stats",
    stats: [
      { value: "28%", label: "Reduction in first-trade drop-off rate" },
      { value: "2.5×", label: "Increase in onboarding-to-first-trade conversion" },
      { value: "9/10", label: "Traders rating the redesigned advanced flow" },
    ],
  },
  {
    type: "text",
    title: "Linear",
    description:
      "Rapid growth created inconsistency across the product. New features increased UX fragmentation. Internal teams moved faster than the system could support.",
    author: { name: "Martin Novák", role: "Lead Designer", avatar: "/images/martin.png" },
  },
  {
    type: "text",
    title: "Stealth AI Startup",
    description:
      "The product was built quickly using AI tools. The UI existed, but the product lacked structure, clarity, and consistency.",
    author: { name: "Milan Horváth", role: "Lead Designer", avatar: "/images/milan.png" },
  },
];

function StatsStrip({ stats }: { stats: StatsItem["stats"] }) {
  const rows: Array<typeof stats> = [];
  for (let i = 0; i < stats.length; i += 3) rows.push(stats.slice(i, i + 3));
  return (
    <div style={DOT_BG} className="col-span-2 rounded-lg py-s9">
      {rows.map((row, i) => (
        <div key={i} className={`grid grid-cols-3 ${i > 0 ? "mt-s9" : ""}`}>
          {row.map((s) => (
            <StatColumn key={s.value} value={s.value} label={s.label} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function CaseStudiesPage() {
  return (
    <main className="bg-white">
      <section className="px-s11 pt-[192px] pb-s12 max-w-page mx-auto">
        <Heading variant="h2">Case Studies</Heading>
      </section>

      <section className="px-s11 max-w-page mx-auto pb-[288px]">
        <div className="grid grid-cols-2 gap-x-s12 gap-y-s12">
          {GRID_ITEMS.map((item, i) => {
            if (item.type === "case-study") {
              return (
                <CaseStudyCard
                  key={i}
                  variant={item.variant}
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  author={item.author}
                />
              );
            }
            if (item.type === "stats") {
              return <StatsStrip key={i} stats={item.stats} />;
            }
            if (item.type === "image") {
              return <ImageBlock key={i} src={item.src} alt={item.alt} className="col-span-2" />;
            }
            return (
              <article key={i} className="flex flex-col">
                <Heading variant="h3" style={{ fontSize: "40px" }}>{item.title}</Heading>
                <Text variant="p2">{item.description}</Text>
                <Refer name={item.author.name} role={item.author.role} avatar={item.author.avatar} className="mt-s3" />
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
