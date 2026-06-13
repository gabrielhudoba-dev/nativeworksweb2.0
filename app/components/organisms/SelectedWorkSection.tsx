"use client";

import { CaseStudyImage, Heading } from "@/app/components/atoms";
import { PrimTextBlock, Slider } from "@/app/components/molecules";
import { useSliderSection } from "@/app/hooks/useSliderSection";
import type { SiteContent, CaseStudyDbItem } from "@/lib/content";

function renderTitle(title: string) {
  return title.split("\n").map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
  ));
}

function CaseCard({ item, imgClass, textClassName = "", split = false }: { item: CaseStudyDbItem; imgClass: string; textClassName?: string; split?: boolean }) {
  return (
    <div className="flex flex-col">
      <CaseStudyImage
        src={item.image_src!}
        alt={item.image_alt ?? item.title ?? ""}
        className={`w-full ${imgClass}`}
      />
      <PrimTextBlock
        title={renderTitle(item.title!)}
        description={item.description!}
        className={`max-sm:!mt-s3 sm:!mt-s6 ${textClassName}`}
        authors={item.authors}
        split={split}
      />
    </div>
  );
}

type Props = { content: SiteContent; items: CaseStudyDbItem[] };

export function SelectedWorkSection({ content, items }: Props) {
  const cases = items.filter((i) => i.type === "case_study");
  if (cases.length === 0) return null;

  const { sliderRef, containerRef, onViewChange } = useSliderSection("work-slider", cases.length);

  return (
    <section id="work" className="max-sm:pt-s3 sm:pt-s9 pb-s18 sm:pb-[192px]">
      <div className="px-page max-w-page mx-auto">
        <Heading variant="h2" className="mb-s6 sm:mb-s9">{content.work_title ?? "Selected work."}</Heading>
      </div>

      {/* Mobile: swipeable slider */}
      <div ref={containerRef} className="sm:hidden px-page max-w-page mx-auto">
        <Slider
          ref={sliderRef}
          cols={1}
          containerClassName="-mx-[var(--gutter)] px-[var(--gutter)] scroll-px-[var(--gutter)]"
          onViewChange={onViewChange}
        >
          {cases.map((item) => (
            <CaseCard key={item.id} item={item} imgClass="!h-[432px]" />
          ))}
        </Slider>
      </div>

      {/* Desktop: original stacked layout */}
      <div className="hidden sm:block px-page max-w-page mx-auto">
        <div className="flex flex-col gap-s12">
          <CaseCard item={cases[0]} imgClass="!h-[432px] sm:!h-[600px]" split />
          {cases.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-s8 gap-y-s12 sm:gap-y-s9">
              {cases.slice(1).map((item) => (
                <CaseCard key={item.id} item={item} imgClass="!h-[360px] sm:!h-[456px]" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
