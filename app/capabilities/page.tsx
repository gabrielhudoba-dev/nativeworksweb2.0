import { Heading } from "@/app/components/atoms";
import { getContent } from "@/lib/content";

export const revalidate = 60;

type CapabilitySection = {
  title: string;
  items: string[];
};

const SECTIONS: CapabilitySection[] = [
  {
    title: "Product Strategy",
    items: [
      "Product definition",
      "Value proposition clarity",
      "Product framing",
      "Ecosystem mapping",
      "Roadmap direction",
      "Decision frameworks",
      "Prioritization frameworks",
    ],
  },
  {
    title: "Research & Product Insight",
    items: [
      "User research strategy",
      "Behavioral journey mapping",
      "Usability testing",
      "Concept validation",
      "Product analytics interpretation",
      "Feature usage analysis",
      "Drop-off and conversion analysis",
      "Identification of growth bottlenecks",
      "Opportunity mapping",
      "AI-assisted research synthesis",
    ],
  },
  {
    title: "Product Design",
    items: [
      "UX architecture",
      "Core interaction flows",
      "Rapid prototyping",
      "Interaction redesign",
      "Information architecture",
      "Design systems",
      "Product writing",
    ],
  },
  {
    title: "Product Systems",
    items: [
      "Friction diagnostics",
      "Product structure evaluation",
      "Interaction architecture audits",
      "System simplification",
      "Cross-team UX alignment",
      "Product governance",
      "Adoption strategy",
      "Structural support for product growth",
      "Alignment between product logic and user behavior",
    ],
  },
  {
    title: "Human-Led AI Delivery",
    items: [
      "AI-assisted concept exploration",
      "AI-accelerated iteration",
      "Production-ready frontend",
      "Targeted implementation",
      "Faster validation cycles",
      "Quality-controlled output",
    ],
  },
  {
    title: "Technical Architecture",
    items: [
      "Technical architecture evaluation",
      "Platform scalability review",
      "Product system restructuring",
      "Technical input for AI-enabled products",
      "Architecture support",
    ],
  },
  {
    title: "Experience Direction",
    items: [
      "Experience direction",
      "Brand expression interaction",
      "Trust and clarity in system behavior",
      "Interaction for AI-enabled products",
      "Future-facing experience principles",
      "Consistency across product surfaces",
    ],
  },
  {
    title: "Product Analytics (light)",
    items: [
      "Product analytics interpretation",
      "Feature usage analysis",
      "Drop-off and conversion analysis",
      "Identification of growth bottlenecks",
    ],
  },
  {
    title: "AI Product Behavior",
    items: [
      "Interaction patterns for AI-enabled products",
      "Trust and clarity in system behavior",
      "AI-assisted concept exploration",
    ],
  },
  {
    title: "Human-AI Interaction",
    items: [
      "Behavioral journey mapping (AI context)",
      "Concept validation (AI-driven flows)",
      "AI-accelerated iteration",
    ],
  },
  {
    title: "Product Adaptation under change",
    items: [
      "Friction diagnostics",
      "System simplification",
      "Product system restructuring",
      "Faster validation cycles",
      "Structural support for product growth",
    ],
  },
];

export default async function CapabilitiesPage() {
  const content = await getContent();

  return (
    <main className="bg-white">

      {/* Hero */}
      <section className="px-page pt-s6 sm:pt-[160px] lg:pt-[192px] pb-s9 max-w-page mx-auto">
        <Heading variant="h2">{content.capabilities_title ?? "Capabilities"}</Heading>
      </section>

      {/* Sections */}
      <section className="px-page max-w-page mx-auto pb-s12 lg:pb-[192px]">
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            className="flex flex-col lg:flex-row gap-s3 lg:items-baseline border-t first:border-t-0 border-prim/10 py-s6 lg:py-s9"
          >
            {/* Category title */}
            <div className="w-full lg:w-[400px] lg:shrink-0">
              <p className="font-display font-medium text-[24px] sm:text-[28px] lg:text-[32px] leading-[1] tracking-[-0.02em] text-prim">{section.title}</p>
            </div>

            {/* Items grid */}
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
