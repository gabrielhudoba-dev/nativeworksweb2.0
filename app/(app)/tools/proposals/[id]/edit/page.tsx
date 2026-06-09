import { notFound } from "next/navigation";
import { getProposal, getProposalBlocks, getDealTitle } from "@/lib/notion-proposals";
import { fromNotionBlock, defaultDocument } from "../../../blocks/types";
import { ProposalEditor } from "./ProposalEditor";

export const dynamic = "force-dynamic";

export default async function EditProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proposal = await getProposal(id);
  if (!proposal) notFound();

  const [notionBlocks, dealTitle] = await Promise.all([
    proposal.blocksDatabaseId
      ? getProposalBlocks(proposal.blocksDatabaseId, proposal.notionPageId)
      : Promise.resolve([]),
    proposal.dealPageId ? getDealTitle(proposal.dealPageId) : Promise.resolve(null),
  ]);

  // Seed the three locked blocks for a brand-new proposal that has none yet.
  const initialBlocks =
    notionBlocks.length > 0 ? notionBlocks.map(fromNotionBlock) : defaultDocument();

  return (
    <ProposalEditor
      proposalPageId={proposal.notionPageId}
      blocksDatabaseId={proposal.blocksDatabaseId}
      title={proposal.title}
      slug={proposal.slug}
      status={proposal.status}
      initialBlocks={initialBlocks}
      dealPageId={proposal.dealPageId}
      dealTitle={dealTitle}
    />
  );
}
