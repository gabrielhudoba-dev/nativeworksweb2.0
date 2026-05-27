"use client";

import { useState } from "react";
import { Badge, Heading, Icon, Text } from "@/app/components/atoms";
import { Button } from "@/app/components/molecules";

const CARD_EMAIL = [
  { name: "Product Sprint", detail: "€5K / 2 weeks" },
  { name: "Continuous Partnership", detail: "€5k–€20k / month" },
  { name: "Last Mile Sprint", detail: "€10k / 4 weeks" },
];

function handleLetStart(e: React.MouseEvent, idx: number) {
  e.stopPropagation();
  const card = CARD_EMAIL[idx];
  const subject = encodeURIComponent(`${card.name} — Let's Start`);
  const body = encodeURIComponent(
    `Hi Native Works,\n\nI'm interested in the ${card.name} (${card.detail}).\n\nPlease get in touch.\n\nBest regards,`
  );
  window.location.href = `mailto:hello@nativeworks.com?subject=${subject}&body=${body}`;
}

export function ServicesSection() {
  const [activeCard, setActiveCard] = useState(0);
  const [sprintExpanded, setSprintExpanded] = useState(false);

  return (
    <section className="py-s9 px-s9 max-w-s15 mx-auto">
      <Heading variant="h2" className="mb-s6">
        Inside the team.<br />Inside the product.
      </Heading>
      <Text variant="p2" className="mb-s8 max-w-[800px]">
        We work closely in to your product focusing on specific problem.
      </Text>
      <div className="grid grid-cols-3 gap-[19px] items-start">

        {/* Product Sprint */}
        <div
          className={`bg-surface rounded-lg flex flex-col justify-between pt-s8 pb-s7 px-s7 min-h-[503px] cursor-pointer ${activeCard === 0 ? "ring-2 ring-prim" : ""}`}
          onClick={() => setActiveCard(0)}
        >
          <div className="flex flex-col gap-s5">
            <Heading variant="h3">Product Sprint</Heading>
            <Text variant="p3">A short, focused sprint to identify key frictions, define improvements, and design a selected part of the product.</Text>
            <button
              type="button"
              className="border-b border-prim inline-block self-start cursor-pointer"
              onClick={() => setSprintExpanded(e => !e)}
            >
              <Text variant="p3" as="span">{sprintExpanded ? "Read less" : "Read more"}</Text>
            </button>
          </div>

          {sprintExpanded && (
            <div className="flex flex-col gap-s6 py-s7 border-t border-prim/10 opacity-60">
              <div className="flex gap-s5 items-start">
                <Icon name="microscope" size="md" className="shrink-0 mt-[3px]" />
                <div className="flex flex-col gap-s3">
                  <Text variant="l2" as="span">Senior-led execution</Text>
                  <Text variant="l2" as="span" className="font-normal">15+ year experienced industry leaders and authorities</Text>
                </div>
              </div>
              <div className="flex gap-s5 items-start">
                <Icon name="person-simple-run" size="md" className="shrink-0 mt-[3px]" />
                <div className="flex flex-col gap-s3">
                  <Text variant="l2" as="span">Fast delivery cycle</Text>
                  <div className="flex items-center gap-[6px]">
                    <Badge variant="ai">AI</Badge>
                    <Text variant="l2" as="span" className="font-normal">integrated process</Text>
                  </div>
                </div>
              </div>
              <div className="flex gap-s5 items-start">
                <Icon name="brackets-curly" size="md" className="shrink-0 mt-[3px]" />
                <div className="flex flex-col gap-s3">
                  <Text variant="l2" as="span">Designed in code</Text>
                  <Text variant="l2" as="span" className="font-normal">Production ready solutions</Text>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-s6">
            <div className="flex items-center justify-between px-s1">
              <Text variant="h5" as="span">€5K</Text>
              <Text variant="h5" as="span">2 weeks</Text>
            </div>
            <Button variant={activeCard === 0 ? "cta-active" : "cta"} rightIcon="arrow-right" className="w-full" onClick={(e) => handleLetStart(e, 0)}>{"Let's Start"}</Button>
          </div>
        </div>

        {/* Continuous Partnership */}
        <div
          className={`bg-surface rounded-lg flex flex-col justify-between pt-s8 pb-s7 px-s7 min-h-[503px] cursor-pointer ${activeCard === 1 ? "ring-2 ring-prim" : ""}`}
          onClick={() => setActiveCard(1)}
        >
          <div className="flex flex-col gap-s5">
            <Heading variant="h3">Continuous Partnership</Heading>
            <Text variant="p3">A short, focused sprint to identify key frictions, define improvements, and design a selected part of the product.</Text>
            <span className="border-b border-prim inline-block self-start">
              <Text variant="p3" as="span">Read more</Text>
            </span>
          </div>
          <div className="flex flex-col gap-s6">
            <div className="flex items-center justify-between px-s4">
              <Text variant="h5" as="span">€5k – €20k</Text>
              <Text variant="h5" as="span">Month</Text>
            </div>
            <Button variant={activeCard === 1 ? "cta-active" : "cta"} rightIcon="arrow-right" className="w-full" onClick={(e) => handleLetStart(e, 1)}>{"Let's Start"}</Button>
          </div>
        </div>

        {/* Last Mile Sprint */}
        <div
          className={`bg-surface rounded-lg flex flex-col justify-between pt-s8 pb-s7 px-s7 min-h-[503px] cursor-pointer ${activeCard === 2 ? "ring-2 ring-prim" : ""}`}
          onClick={() => setActiveCard(2)}
        >
          <div className="flex flex-col gap-s5">
            <Heading variant="h3">Last Mile Sprint</Heading>
            <Text variant="p3">A focused sprint to validate, refine, and bring your product to a usable, production-ready state.</Text>
            <span className="border-b border-prim inline-block self-start">
              <Text variant="p3" as="span">Read more</Text>
            </span>
          </div>
          <div className="flex flex-col gap-s6">
            <div className="flex items-center justify-between px-s4">
              <Text variant="h5" as="span">€10k</Text>
              <Text variant="h5" as="span">4 weeks</Text>
            </div>
            <Button variant={activeCard === 2 ? "cta-active" : "cta"} rightIcon="arrow-right" className="w-full" onClick={(e) => handleLetStart(e, 2)}>{"Let's Start"}</Button>
          </div>
        </div>

      </div>
    </section>
  );
}
