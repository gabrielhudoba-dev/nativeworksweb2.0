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
  expandedContent?: React.ReactNode;
};

export function ServiceCard({ title, desc, price, duration, active, onClick, onLetStart, expandedContent }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-surface rounded-lg flex flex-col justify-between pt-s8 pb-s7 px-s7 min-h-[503px] cursor-pointer ${active ? "ring-2 ring-prim" : ""}`}
      onClick={onClick}
    >
      <div className="flex flex-col gap-s5">
        <Heading variant="h3">{title}</Heading>
        <Text variant="p3">{desc}</Text>
        <button
          type="button"
          className={`border-b border-prim inline-block self-start ${expandedContent ? "cursor-pointer" : "cursor-default"}`}
          onClick={(e) => { if (expandedContent) { e.stopPropagation(); setExpanded(v => !v); } }}
        >
          <Text variant="p3" as="span">{expanded && expandedContent ? "Read less" : "Read more"}</Text>
        </button>
      </div>

      {expanded && expandedContent && (
        <div className="flex flex-col gap-s6 py-s7 border-t border-prim/10 opacity-60">
          {expandedContent}
        </div>
      )}

      <div className="flex flex-col gap-s6">
        <div className="flex items-center justify-between px-s1">
          <Text variant="h5" as="span">{price}</Text>
          <Text variant="h5" as="span">{duration}</Text>
        </div>
        <Button variant={active ? "cta-active" : "cta"} rightIcon="arrow-right" className="w-full" onClick={onLetStart}>
          {"Let's Start"}
        </Button>
      </div>
    </div>
  );
}
