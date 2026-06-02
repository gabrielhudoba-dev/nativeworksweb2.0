"use client";

import { useState } from "react";
import { Badge, Heading, Icon, Text } from "@/app/components/atoms";
import { ServiceCard } from "@/app/components/molecules/ServiceCard";

function handleLetStart(e: React.MouseEvent, card: { name: string; detail: string }) {
  e.stopPropagation();
  const subject = encodeURIComponent(`${card.name} — Let's Start`);
  const body = encodeURIComponent(
    `Hi Native Works,\n\nI'm interested in the ${card.name} (${card.detail}).\n\nPlease get in touch.\n\nBest regards,`
  );
  window.location.href = `mailto:hello@nativeworks.com?subject=${subject}&body=${body}`;
}

import type { SiteContent, Service } from "@/lib/content";

type Props = { content: SiteContent; services: Service[] };

export function ServicesSection({ content, services }: Props) {
  const [activeCard, setActiveCard] = useState(0);

  const sprintFeatures = (
    <>
      <div className="flex gap-s2 items-start">
        <Icon name="microscope" size="md" className="shrink-0 mt-[3px]" />
        <div className="flex flex-col gap-s1">
          <Text variant="l2" as="span">{content.sprint_features_f1_title ?? "Senior-led execution"}</Text>
          <Text variant="l2" as="span" className="font-normal">{content.sprint_features_f1_desc ?? "15+ year experienced industry leaders and authorities"}</Text>
        </div>
      </div>
      <div className="flex gap-s2 items-start">
        <Icon name="person-simple-run" size="md" className="shrink-0 mt-[3px]" />
        <div className="flex flex-col gap-s1">
          <Text variant="l2" as="span">{content.sprint_features_f2_title ?? "Fast delivery cycle"}</Text>
          <div className="flex items-center gap-[6px]">
            <Badge variant="ai">AI</Badge>
            <Text variant="l2" as="span" className="font-normal">{content.sprint_features_f2_desc ?? "integrated process"}</Text>
          </div>
        </div>
      </div>
      <div className="flex gap-s2 items-start">
        <Icon name="brackets-curly" size="md" className="shrink-0 mt-[3px]" />
        <div className="flex flex-col gap-s1">
          <Text variant="l2" as="span">{content.sprint_features_f3_title ?? "Designed in code"}</Text>
          <Text variant="l2" as="span" className="font-normal">{content.sprint_features_f3_desc ?? "Production ready solutions"}</Text>
        </div>
      </div>
    </>
  );

  return (
    <section className="pt-s5 sm:pt-s9 pb-s6 sm:pb-s12 px-page max-w-page mx-auto">
      <Heading variant="h2" className="mb-s3">
        {(content.services_title ?? "Inside the team.\nInside the product.").split("\n").map((line, i, arr) => (
          <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
        ))}
      </Heading>
      <Text variant="p2" className="mb-s6 sm:mb-s12 max-w-[800px]">
        {content.services_desc ?? "We work closely in to your product focusing on specific problem."}
      </Text>
      <div className="overflow-x-auto -mx-[var(--gutter)] py-s3 -my-s3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid grid-flow-col auto-cols-[300px] sm:auto-cols-[320px] lg:grid-flow-row lg:grid-cols-3 lg:auto-cols-auto gap-s1 pl-[var(--gutter)] [&>*:last-child]:mr-[var(--gutter)] snap-x snap-mandatory lg:snap-none lg:[&>*:last-child]:mr-0">
          {services.map((card, i) => (
            <ServiceCard
              key={card.title}
              title={card.title}
              desc={card.desc}
              price={card.price}
              duration={card.duration}
              active={activeCard === i}
              onClick={() => setActiveCard(i)}
              onLetStart={(e) => handleLetStart(e, { name: card.title, detail: `${card.price} / ${card.duration}` })}
              expandedContent={i === 0 ? sprintFeatures : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
