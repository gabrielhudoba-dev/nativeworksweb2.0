import type { Metadata } from "next";
import { Heading, ImageBlock, Text } from "@/app/components/atoms";
import { LogoMarquee, Refer, StatColumn } from "@/app/components/molecules";
import { CaseStudyCard } from "@/app/components/organisms";
import { getContent, getCaseStudiesItems } from "@/lib/content";
import { DOT_BG } from "@/app/styles/patterns";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "33% retention up for Kontentino. 67% fewer support tickets for Clarify. 28% activation lift for Payrly. Real product decisions, measured outcomes.",
  openGraph: {
    title: "Case Studies — Native Works",
    description:
      "33% retention up for Kontentino. 67% fewer support tickets for Clarify. 28% activation lift for Payrly. Real product decisions, measured outcomes.",
    url: "https://nativeworks.eu/case-studies",
  },
  twitter: {
    title: "Case Studies — Native Works",
    description:
      "33% retention up for Kontentino. 67% fewer support tickets for Clarify. 28% activation lift for Payrly. Real product decisions, measured outcomes.",
  },
};

function StatsStrip({ stats }: { stats: Array<{ value: string; label: string }> }) {
  const rows: Array<typeof stats> = [];
  for (let i = 0; i < stats.length; i += 3) rows.push(stats.slice(i, i + 3));
  return (
    <div style={DOT_BG} className="col-span-1 sm:col-span-2 rounded-lg py-s6 sm:py-s9 px-0">
      {rows.map((row, i) => (
        <div key={i} className={`grid grid-cols-1 sm:grid-cols-3 gap-y-s6 sm:gap-y-0 ${i > 0 ? "mt-s6 sm:mt-s9" : ""}`}>
          {row.map((s) => (
            <StatColumn key={s.value} value={s.value} label={s.label} />
          ))}
        </div>
      ))}
    </div>
  );
}

function renderTitle(title: string) {
  return title.split("\n").map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
  ));
}

export default async function CaseStudiesPage() {
  const [content, items] = await Promise.all([
    getContent("case-studies"),
    getCaseStudiesItems(),
  ]);

  return (
    <main className="bg-white">
      <section className="px-page pt-s6 sm:pt-[160px] lg:pt-[192px] pb-s6 max-w-page mx-auto">
        <Heading variant="h3" as="h1">{content.hero_title ?? "Case Studies"}</Heading>
      </section>

      <section className="px-page max-w-page mx-auto pb-s12 lg:pb-[288px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-s12 gap-y-s6 sm:gap-y-s12">
          {items.map((item, i) => {
            if (item.type === "case_study") {
              return (
                <div key={item.id} className="col-span-1 sm:col-span-2">
                  <CaseStudyCard
                    variant={item.variant as "left" | "right"}
                    image={{ src: item.image_src!, alt: item.image_alt! }}
                    title={renderTitle(item.title!)}
                    description={item.description!}
                    authors={item.authors}
                  />
                </div>
              );
            }
            if (item.type === "stats") {
              return <div key={item.id} className="col-span-1 sm:col-span-2"><StatsStrip stats={item.stats} /></div>;
            }
            if (item.type === "image") {
              return <div key={item.id} className="col-span-1 sm:col-span-2"><ImageBlock src={item.image_src!} alt={item.image_alt!} variant="fill" className="h-[360px]" /></div>;
            }
            const prevItem = i > 0 ? items[i - 1] : null;
            return (
              <article key={item.id} className={`flex flex-col${prevItem?.type === "text" ? " mt-s6 sm:mt-0" : ""}`}>
                <Heading variant="h3">{renderTitle(item.title!)}</Heading>
                <Text variant="p2">{item.description}</Text>
                {item.authors[0] && (
                  <Refer name={item.authors[0].name} role={item.authors[0].role} avatar={item.authors[0].avatar} className="mt-s3" />
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="pt-s7 sm:pt-s9 pb-s12 lg:pb-[288px]">
        <LogoMarquee />
      </section>
    </main>
  );
}
