import { notFound } from "next/navigation";
import { getProposalBySlug } from "@/lib/notion-proposals";
import { BookEmbed } from "./BookEmbed";

export const dynamic = "force-dynamic";

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);
  if (!proposal) notFound();

  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK;

  return (
    <main className="mx-auto w-full max-w-[760px] px-s5 py-s12 flex flex-col gap-s6">
      <div className="flex flex-col gap-s2">
        <a href={`/p/${slug}`} className="font-body text-l2 text-prim/40 hover:text-prim transition-colors">
          ← Back to proposal
        </a>
        <h1 className="font-display font-medium text-h2 text-prim tracking-[-0.02em]">Book a call</h1>
        <p className="font-body text-p2 text-prim/55">
          Pick a time that suits you — we&apos;ll walk through the proposal together.
        </p>
      </div>

      {calLink ? (
        <BookEmbed calLink={calLink} slug={slug} />
      ) : (
        <div className="grain bg-surface rounded-lg flex flex-col items-center gap-s2 py-s12 text-center">
          <p className="font-body text-p2 text-prim/70">Booking isn&apos;t configured yet.</p>
          <p className="font-body text-l3 text-prim/40">
            Set <code className="text-prim/60">NEXT_PUBLIC_CALCOM_LINK</code> to your Cal.com event
            (e.g. <code className="text-prim/60">nativeworks/intro</code>).
          </p>
        </div>
      )}
    </main>
  );
}
