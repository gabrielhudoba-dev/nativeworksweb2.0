import { notFound } from "next/navigation";
import { getProposalBySlug, getProposalBlocks } from "@/lib/notion-proposals";
import { fromNotionBlock } from "@/app/(app)/tools/blocks/types";
import { BlockView } from "@/app/(app)/tools/blocks/registry";
import { Icon } from "@/app/components/atoms";
import { ViewTracker } from "./ViewTracker";
import { ProposalCTA } from "./ProposalCTA";

export const dynamic = "force-dynamic";

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
  const blocks = notionBlocks.map(fromNotionBlock);

  return (
    <main className="mx-auto w-full max-w-[760px] px-s5 py-s12 flex flex-col gap-s12">
      <ViewTracker slug={slug} />

      {blocks.length === 0 ? (
        <p className="font-body text-p2 text-prim/40 text-center py-s16">
          This proposal is still being prepared.
        </p>
      ) : (
        blocks.map((block) => {
          if (block.blockType === "cta") {
            return proposal.status === "signed" ? (
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
            );
          }
          return <BlockView key={block.id} block={block} mode="view" />;
        })
      )}
    </main>
  );
}
