"use client";

import { useState } from "react";
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
  const [expanded, setExpanded] = useState(false);

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
      <div
        className="flex-1 flex flex-col"
        onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
      >
        <Text
          variant="p2"
          className={`pl-s2 pr-s2 mt-s5 mb-s6 cursor-pointer ${expanded ? "" : "line-clamp-4"}`}
        >
          {desc}
        </Text>
      </div>
      {features && features.length > 0 && (
        <div className="flex flex-col py-[12px] pl-s2 pr-s2">
          {features.map((feat, i) => (
            <div key={feat}>
              {i > 0 && <div className="h-px bg-prim/20 my-s3" />}
              <Text variant="h5" as="p">{feat}</Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
