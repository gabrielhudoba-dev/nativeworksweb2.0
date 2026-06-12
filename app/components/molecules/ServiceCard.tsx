"use client";

import { Text, Heading } from "@/app/components/atoms";
import { Button } from "./Button";

type Props = {
  title: string;
  desc: string;
  price: string;
  duration: string;
  active: boolean;
  onClick: () => void;
  onLetStart: (e: React.MouseEvent) => void;
  features?: string[];
};

export function ServiceCard({ title, desc, price, duration, active, onClick, onLetStart, features }: Props) {
  // `desc` may carry an "Outcome:" tail — split it out so the outcome renders
  // as its own small label + text block below the main description.
  const outcomeIdx = desc.indexOf("Outcome:");
  const mainText = (outcomeIdx >= 0 ? desc.slice(0, outcomeIdx) : desc).trim();
  const outcomeText = outcomeIdx >= 0 ? desc.slice(outcomeIdx + "Outcome:".length).trim() : "";

  return (
    <div className="flex flex-col h-full cursor-pointer" onClick={onClick}>
      <div className="grain bg-surface rounded-[12px] flex flex-col justify-between min-h-[370px] pt-s6 pb-s4 px-s2">
        <div className="px-[8px]">
          <Heading variant="h4" className="text-[24px] leading-[24px]">
            {title.split(' ').slice(0, -1).join(' ')}<br />{title.split(' ').at(-1)}™
          </Heading>
        </div>
        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between px-[8px] pb-s3">
            <Text variant="h5" as="span">{price}</Text>
            <Text variant="h5" as="span">{duration}</Text>
          </div>
          <Button
            variant={active ? "dark" : "secondary"}
            size="lg"
            rightIcon="arrow-right"
            className="w-full"
            onClick={active ? onLetStart : (e) => { e.stopPropagation(); onClick(); }}
          >
            {"Let's Start"}
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-s4 pl-s2 pr-s2 mt-s5 mb-s6">
        <div className="flex flex-col gap-s1">
          <Text
            variant="p3"
            className="uppercase tracking-[0.08em] !text-[13px] !leading-none"
            style={{ color: "rgba(18,19,25,0.5)" }}
          >
            Overview
          </Text>
          <Text variant="p2">{mainText}</Text>
        </div>
        {outcomeText && (
          <div className="flex flex-col gap-s1">
            <Text
              variant="p3"
              className="uppercase tracking-[0.08em] !text-[13px] !leading-none"
              style={{ color: "rgba(18,19,25,0.5)" }}
            >
              Outcome
            </Text>
            <Text variant="p2">{outcomeText}</Text>
          </div>
        )}
      </div>
    </div>
  );
}
