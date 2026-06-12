import { Heading, Text } from "@/app/components/atoms";
import { Button } from "@/app/components/molecules";
import type { SiteContent } from "@/lib/content";

type Props = { content: SiteContent };

/** Homepage closing CTA — centered headline + sub + "Book a call". */
export function CtaSection({ content }: Props) {
  const calSlug = process.env.NEXT_PUBLIC_CALCOM_LINK;
  const bookHref = calSlug ? `https://cal.com/${calSlug}` : "mailto:hello@nativeworks.com";

  return (
    <section id="contact" className="pt-s9 sm:pt-[160px] pb-s9 sm:pb-s12 px-page max-w-page mx-auto">
      <div className="flex flex-col items-start sm:items-center gap-s4 sm:gap-s6 text-left sm:text-center">
        <Heading variant="h1" className="max-w-[800px]">
          {content.cta_title ?? "Let's build what's next."}
        </Heading>
        <Text variant="p2" className="max-w-[480px]">
          {content.cta_desc ?? "One call. A senior pod on your problem within two weeks."}
        </Text>
        <div className="pt-s2">
          <Button variant="primary" href={bookHref} rightIcon="arrow-right">
            {content.cta_button ?? "Book a call"}
          </Button>
        </div>
      </div>
    </section>
  );
}
