"use client";

import { Heading, Icon, Text } from "@/app/components/atoms";
import { NavigationDots } from "@/app/components/molecules";

function Attribution({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-12">
      <div className="size-48 rounded-pill bg-surface shrink-0" />
      <div className="flex flex-col gap-4">
        <Text variant="meta" as="span" className="font-medium text-fg">
          {name}
        </Text>
        <Text variant="meta-sm" as="span" className="text-fg/50">
          {role}
        </Text>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-page overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="px-80 pt-16 pb-0 max-w-1440 mx-auto">
        {/* Navigation */}
        <nav className="flex flex-col items-center mb-48" aria-label="Site navigation">
          {/* Logo row */}
          <div className="flex items-center justify-between w-[340px] py-12">
            <span className="font-display font-medium text-meta text-prim leading-tight">
              Native
              <br />
              Works
            </span>
            <Icon name="arrow-right" size="md" className="text-fg opacity-40" />
          </div>

          {/* Step nav */}
          <div className="flex items-center gap-16">
            <button
              type="button"
              aria-label="Previous"
              className="size-24 flex items-center justify-center text-fg/40 hover:text-fg transition-colors"
            >
              <Icon name="caret-left" size="md" />
            </button>
            <NavigationDots count={5} initialIndex={0} />
            <button
              type="button"
              aria-label="Next"
              className="size-24 flex items-center justify-center text-fg/40 hover:text-fg transition-colors"
            >
              <Icon name="caret-right" size="md" />
            </button>
          </div>
        </nav>

        {/* Display heading */}
        <Heading
          variant="display"
          className="max-w-[672px] mx-auto text-center mb-32"
        >
          New era of digital product design.
        </Heading>

        {/* Body copy */}
        <Text
          variant="body"
          className="max-w-[545px] mx-auto text-center text-fg/50 mb-80"
        >
          A curated group of product specialists working on your mobile app or
          web system. Inside your team. Solving product problems from early
          concepts to product friction. With a level of speed previously
          impossible. Delivered through to production-ready output.
        </Text>

        {/* Pre-image row */}
        <div className="flex items-end justify-between mb-16">
          <Heading
            variant="h2"
            as="p"
            className="max-w-[339px] text-fg"
          >
            Product creation is changing. Shorter cycles. Faster Outcome.
          </Heading>
          <Attribution name="Martin Mroc" role="CDO, Vibe Studio" />
        </div>

        {/* Hero image */}
        <div
          className="w-full rounded-lg overflow-hidden bg-surface"
          style={{ aspectRatio: "1320 / 640" }}
        />
      </section>

      {/* ─── Stats ─── */}
      <section
        className="py-80 px-80 max-w-1440 mx-auto"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(9,14,58,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "25px 25px",
        }}
      >
        {/* Section heading */}
        <Heading variant="display" className="max-w-[481px] mb-16">
          Better products.
          <br />
          Delivered faster.
        </Heading>

        {/* Subheading */}
        <Heading variant="h2" as="p" className="text-fg/50 font-normal mb-80">
          Fewer steps. Higher quality. AI-accelerated.
        </Heading>

        {/* Stats row */}
        <div className="grid grid-cols-3">
          {/* Stat 1 */}
          <div className="flex flex-col gap-8">
            <Heading variant="stat">2 weeks</Heading>
            <Text variant="body" className="text-fg/50 max-w-[260px]">
              Avg. time to first value
            </Text>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col gap-8">
            <Heading variant="stat">33%</Heading>
            <Text variant="body" className="text-fg/50 max-w-[300px]">
              Increase in weekly active user retention in Kontentino by
            </Text>
            <div className="mt-16">
              <Attribution name="Milan Tibansky" role="Growth Lead" />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col gap-8">
            <Heading variant="stat">8/10</Heading>
            <Text variant="body" className="text-fg/50 max-w-[260px]">
              Clients continuing after first sprint
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
}
