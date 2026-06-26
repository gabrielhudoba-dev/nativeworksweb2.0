import type { Metadata } from "next";
import { Heading } from "@/app/components/atoms";
import { getContent, getCapabilitiesSections } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Product strategy, research, UX design, design systems, human-led AI delivery, technical architecture, and AI product behavior — the full stack of what Native Works brings inside your team.",
  openGraph: {
    title: "Capabilities — Native Works",
    description:
      "Product strategy, research, UX design, design systems, human-led AI delivery, technical architecture, and AI product behavior — the full stack of what Native Works brings inside your team.",
    url: "https://nativeworks.eu/capabilities",
  },
  twitter: {
    title: "Capabilities — Native Works",
    description:
      "Product strategy, research, UX design, design systems, human-led AI delivery, technical architecture, and AI product behavior — the full stack of what Native Works brings inside your team.",
  },
};

export default async function CapabilitiesPage() {
  const [content, sections] = await Promise.all([
    getContent("capabilities"),
    getCapabilitiesSections(),
  ]);

  return (
    <main className="bg-white">

      {/* Hero */}
      <section className="px-page pt-s6 sm:pt-[160px] lg:pt-[192px] pb-s9 max-w-page mx-auto">
        <Heading variant="h2">{content.hero_title ?? "Capabilities"}</Heading>
      </section>

      {/* Sections */}
      <section className="px-page max-w-page mx-auto pb-s12 lg:pb-[192px]">
        {sections.map((section) => (
          <div key={section.id} className="flex flex-col lg:flex-row gap-s3 lg:items-baseline border-t first:border-t-0 border-prim/10 py-s6 lg:py-s9">
            <div className="w-full lg:w-[400px] lg:shrink-0">
              <p className="font-display font-medium text-[24px] sm:text-[28px] lg:text-[32px] leading-[1] tracking-[-0.02em] text-prim">{section.title}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-s3 gap-y-s1 sm:gap-y-0 flex-1">
              {section.items.map((item) => (
                <p
                  key={item}
                  className="font-body font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-[24px] tracking-[-0.02em] text-prim"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>

    </main>
  );
}
