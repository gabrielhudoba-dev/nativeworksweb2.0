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

/** One case: full-width visual on top, then title + description + author below.
 *  `split` lays the text out as two columns (title | description + authors). */
function CaseCard({ item, imgClass, textClassName = "!mt-s3", split = false }: { item: CaseStudyDbItem; imgClass: string; textClassName?: string; split?: boolean }) {
  return (
    <div className="flex flex-col">
      <div className="relative">
        <CaseStudyImage
          src={item.image_src!}
          alt={item.image_alt ?? item.title ?? ""}
          className={`w-full ${imgClass}`}
        />
        {item.title === "Payrly" && (
          <img
            src="/images/slider/payrlylogoshort.svg"
            alt="Payrly"
            className="absolute inset-0 m-auto h-s10 w-auto z-10"
          />
        )}
      </div>
      <PrimTextBlock
        title={renderTitle(item.title!)}
        description={item.description!}
        className={textClassName}
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
        <Heading variant="h2" className="mb-s6">{content.work_title ?? "Selected work."}</Heading>
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

      {/* Desktop: two-column grid */}
      <div className="hidden sm:block px-page max-w-page mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-s3">
          {cases.map((item) => (
            <CaseCard key={item.id} item={item} imgClass="!h-[360px] sm:!h-[456px]" />
          ))}
        </div>
      </div>
    </section>
  );
}
