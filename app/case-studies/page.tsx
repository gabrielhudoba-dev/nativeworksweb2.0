import { Heading, ImageBlock, Text } from "@/app/components/atoms";
import { Refer, StatColumn } from "@/app/components/molecules";
import { CaseStudyCard } from "@/app/components/organisms";
import { getContent, getCaseStudiesItems } from "@/lib/content";
import { DOT_BG } from "@/app/styles/patterns";

export const revalidate = 60;

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
        <Heading variant="h3" as="h1" style={{ fontSize: "40px" }}>{content.hero_title ?? "Case Studies"}</Heading>
      </section>

      <section className="px-page max-w-page mx-auto pb-s12 lg:pb-[288px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-s12 gap-y-s6 sm:gap-y-s12">
          {items.map((item, i) => {
            if (item.type === "case_study") {
              return (
                <CaseStudyCard
                  key={item.id}
                  variant={item.variant as "left" | "right"}
                  image={{ src: item.image_src!, alt: item.image_alt! }}
                  title={renderTitle(item.title!)}
                  description={item.description!}
                  author={{ name: item.author_name!, role: item.author_role!, avatar: item.author_avatar! }}
                />
              );
            }
            if (item.type === "stats") {
              return <StatsStrip key={item.id} stats={item.stats} />;
            }
            if (item.type === "image") {
              return <ImageBlock key={item.id} src={item.image_src!} alt={item.image_alt!} variant="fill" className="col-span-1 sm:col-span-2 h-[360px]" />;
            }
            const prevItem = i > 0 ? items[i - 1] : null;
            return (
              <article key={item.id} className={`flex flex-col${prevItem?.type === "text" ? " mt-s6 sm:mt-0" : ""}`}>
                <Heading variant="h3" style={{ fontSize: "40px" }}>{renderTitle(item.title!)}</Heading>
                <Text variant="p2">{item.description}</Text>
                <Refer name={item.author_name!} role={item.author_role!} avatar={item.author_avatar!} className="mt-s3" />
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
