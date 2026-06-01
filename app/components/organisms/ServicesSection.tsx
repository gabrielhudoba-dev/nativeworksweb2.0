"use client";

import { useState } from "react";
import { Badge, Heading, Icon, Text } from "@/app/components/atoms";
import { ServiceCard } from "@/app/components/molecules/ServiceCard";

const CARDS = [
  {
    title: "Product Sprint",
    desc: "A short, focused sprint to identify key frictions, define improvements, and design a selected part of the product.",
    price: "€5K",
    duration: "2 weeks",
    email: { name: "Product Sprint", detail: "€5K / 2 weeks" },
  },
  {
    title: "Continuous Partnership",
    desc: "A short, focused sprint to identify key frictions, define improvements, and design a selected part of the product.",
    price: "€5k – €20k",
    duration: "Month",
    email: { name: "Continuous Partnership", detail: "€5k–€20k / month" },
  },
  {
    title: "Last Mile Sprint",
    desc: "A focused sprint to validate, refine, and bring your product to a usable, production-ready state.",
    price: "€10k",
    duration: "4 weeks",
    email: { name: "Last Mile Sprint", detail: "€10k / 4 weeks" },
  },
];

function handleLetStart(e: React.MouseEvent, card: { name: string; detail: string }) {
  e.stopPropagation();
  const subject = encodeURIComponent(`${card.name} — Let's Start`);
  const body = encodeURIComponent(
    `Hi Native Works,\n\nI'm interested in the ${card.name} (${card.detail}).\n\nPlease get in touch.\n\nBest regards,`
  );
  window.location.href = `mailto:hello@nativeworks.com?subject=${subject}&body=${body}`;
}

const SPRINT_FEATURES = (
  <>
    <div className="flex gap-s2 items-start">
      <Icon name="microscope" size="md" className="shrink-0 mt-[3px]" />
      <div className="flex flex-col gap-s1">
        <Text variant="l2" as="span">Senior-led execution</Text>
        <Text variant="l2" as="span" className="font-normal">15+ year experienced industry leaders and authorities</Text>
      </div>
    </div>
    <div className="flex gap-s2 items-start">
      <Icon name="person-simple-run" size="md" className="shrink-0 mt-[3px]" />
      <div className="flex flex-col gap-s1">
        <Text variant="l2" as="span">Fast delivery cycle</Text>
        <div className="flex items-center gap-[6px]">
          <Badge variant="ai">AI</Badge>
          <Text variant="l2" as="span" className="font-normal">integrated process</Text>
        </div>
      </div>
    </div>
    <div className="flex gap-s2 items-start">
      <Icon name="brackets-curly" size="md" className="shrink-0 mt-[3px]" />
      <div className="flex flex-col gap-s1">
        <Text variant="l2" as="span">Designed in code</Text>
        <Text variant="l2" as="span" className="font-normal">Production ready solutions</Text>
      </div>
    </div>
  </>
);

export function ServicesSection() {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section className="pt-s5 sm:pt-s9 pb-s6 sm:pb-s12 px-page max-w-page mx-auto">
      <Heading variant="h2" className="mb-s3">
        Inside the team.<br />Inside the product.
      </Heading>
      <Text variant="p2" className="mb-s6 sm:mb-s12 max-w-[800px]">
        We work closely in to your product focusing on specific problem.
      </Text>
      <div className="overflow-x-auto -mx-[var(--gutter)] py-s3 -my-s3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid grid-flow-col auto-cols-[300px] sm:auto-cols-[320px] lg:grid-flow-row lg:grid-cols-3 lg:auto-cols-auto gap-s1 pl-[var(--gutter)] [&>*:last-child]:mr-[var(--gutter)] snap-x snap-mandatory lg:snap-none lg:[&>*:last-child]:mr-0">
          {CARDS.map((card, i) => (
            <ServiceCard
              key={card.title}
              title={card.title}
              desc={card.desc}
              price={card.price}
              duration={card.duration}
              active={activeCard === i}
              onClick={() => setActiveCard(i)}
              onLetStart={(e) => handleLetStart(e, card.email)}
              expandedContent={i === 0 ? SPRINT_FEATURES : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
