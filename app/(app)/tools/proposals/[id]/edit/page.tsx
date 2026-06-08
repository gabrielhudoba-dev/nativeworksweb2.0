import { notFound } from "next/navigation";
import { getProposal, getProposalBlocks } from "@/lib/notion-proposals";
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

  const notionBlocks = proposal.blocksDatabaseId
    ? await getProposalBlocks(proposal.blocksDatabaseId, proposal.notionPageId)
    : [];

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
    />
  );
}
