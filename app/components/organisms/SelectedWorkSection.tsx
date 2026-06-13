import { CaseStudyImage, Heading } from "@/app/components/atoms";
import { PrimTextBlock } from "@/app/components/molecules";
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
      <CaseStudyImage
        src={item.image_src!}
        alt={item.image_alt ?? item.title ?? ""}
        className={`w-full ${imgClass}`}
      />
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

/**
 * Homepage "Selected work" — first case spans the full width, the remaining
 * cases sit two-up below it (wireframe: one row of one, one row of two).
 */
export function SelectedWorkSection({ content, items }: Props) {
  const cases = items.filter((i) => i.type === "case_study");
  if (cases.length === 0) return null;
  const [hero, ...rest] = cases;

  return (
    <section id="work" className="pt-s9 pb-s18 sm:pb-[192px] px-page max-w-page mx-auto">
      <Heading variant="h2" className="mb-s6 sm:mb-s9">{content.work_title ?? "Selected work."}</Heading>

      <div className="flex flex-col gap-s12">
        <CaseCard item={hero} imgClass="!h-[432px] sm:!h-[600px]" split textClassName="!mt-s3" />

        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-s3">
            {rest.map((item) => (
              <CaseCard key={item.id} item={item} imgClass="!h-[360px] sm:!h-[456px]" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
