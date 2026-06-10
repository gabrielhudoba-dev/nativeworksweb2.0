import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProposalBySlug, getProposalBlocks } from "@/lib/notion-proposals";
import { fromNotionBlock } from "@/app/(app)/tools/blocks/types";
import { BlockView } from "@/app/(app)/tools/blocks/registry";
import { Icon } from "@/app/components/atoms";
import { ViewTracker } from "./ViewTracker";
import { ProposalCTA } from "./ProposalCTA";
import { ProposalApproach } from "./ProposalApproach";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);
  if (!proposal?.title) return { title: "Proposal | Native Works" };
  return { title: `${proposal.title} | Native Works` };
}

export default async function PublicProposalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);
  if (!proposal) notFound();

  const notionBlocks = proposal.blocksDatabaseId
    ? await getProposalBlocks(proposal.blocksDatabaseId, proposal.notionPageId)
    : [];
  // Reorder: pricing always follows approach directly; partnership always precedes process
  const rawBlocks = notionBlocks.map(fromNotionBlock);

  function moveBlock(
    arr: typeof rawBlocks,
    movingType: string,
    beforeType: string,
  ): typeof rawBlocks {
    const movingIdx = arr.findIndex((b) => b.blockType === movingType);
    const anchorIdx = arr.findIndex((b) => b.blockType === beforeType);
    if (movingIdx === -1 || anchorIdx === -1 || movingIdx === anchorIdx - 1) return arr;
    const moving = arr[movingIdx];
    const without = arr.filter((_, i) => i !== movingIdx);
    const insertAt = without.findIndex((b) => b.blockType === beforeType);
    return [...without.slice(0, insertAt), moving, ...without.slice(insertAt)];
  }

  let blocks = rawBlocks;
  blocks = moveBlock(blocks, "pricing", "pricing"); // no-op placeholder
  // pricing follows approach
  const approachIdx = blocks.findIndex((b) => b.blockType === "approach");
  const pricingIdx = blocks.findIndex((b) => b.blockType === "pricing");
  if (approachIdx !== -1 && pricingIdx !== -1 && pricingIdx !== approachIdx + 1) {
    const pricing = blocks[pricingIdx];
    const without = blocks.filter((_, i) => i !== pricingIdx);
    const insertAt = without.findIndex((b) => b.blockType === "approach") + 1;
    blocks = [...without.slice(0, insertAt), pricing, ...without.slice(insertAt)];
  }
  // partnership precedes process
  blocks = moveBlock(blocks, "partnership", "process");

  const beforeCta: React.ReactNode[] = [];
  const afterCta: React.ReactNode[] = [];
  let pastCta = false;
  let idx = 0;

  while (idx < blocks.length) {
    const block = blocks[idx];
    const next = blocks[idx + 1];
    const target = pastCta ? afterCta : beforeCta;

    if (block.blockType === "approach" && next?.blockType === "pricing") {
      target.push(
        <ProposalApproach key={block.id} approachBlock={block} pricingBlock={next} />
      );
      idx += 2;
      continue;
    }

    if (block.blockType === "cta") {
      pastCta = true;
      beforeCta.push(
        proposal.status === "signed" ? (
          <section key={block.id} className="flex items-center gap-s3 pt-s8 border-t border-prim/10">
            <span className="grid place-items-center size-s6 rounded-pill bg-success text-white">
              <Icon name="check" size="md" />
            </span>
            <div className="flex flex-col">
              <span className="font-display font-medium text-h4 text-prim">Signed</span>
              <span className="font-body text-l2 text-prim/50">
                This proposal has been accepted and signed. Thank you.
              </span>
            </div>
          </section>
        ) : (
          <ProposalCTA
            key={block.id}
            slug={slug}
            calLink={process.env.NEXT_PUBLIC_CALCOM_LINK ?? "gabrielhudoba/engagement"}
            proposalTitle={proposal.title ?? ""}
          />
        )
      );
      idx++;
      continue;
    }

    target.push(<BlockView key={block.id} block={block} mode="view" />);
    if (block.blockType === "partnership" && pastCta) {
      target.push(
        <img
          key={`${block.id}-team`}
          src="/images/teamImageNarrow.png"
          alt="Native Works team"
          className="w-full rounded-xl object-cover max-h-[320px]"
        />
      );
    }
    idx++;
  }

  return (
    <>
      <main id="main-content" className="mx-auto w-full max-w-[760px] px-s3 sm:px-s5 py-s12 flex flex-col gap-s12">
        <ViewTracker slug={slug} />
        {blocks.length === 0 ? (
          <p className="font-body text-p2 text-prim/40 text-center py-s16">
            This proposal is still being prepared.
          </p>
        ) : beforeCta}
      </main>

      {afterCta.length > 0 && (
        <div className="w-full bg-prim/[0.025] pt-s12 pb-s8">
          <div className="mx-auto w-full max-w-[760px] px-s3 sm:px-s5 flex flex-col gap-s12">
            {afterCta}
          </div>
        </div>
      )}
    </>
  );
}
