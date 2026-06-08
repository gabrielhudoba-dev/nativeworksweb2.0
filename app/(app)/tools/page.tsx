import { listProposals } from "@/lib/notion-proposals";
import { Text } from "@/app/components/atoms";
import { PageShell } from "../components/PageShell";
import { ProposalRow } from "./proposals/ProposalRow";
import { NewProposalButton } from "./NewProposalButton";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const proposals = await listProposals();

  return (
    <PageShell width="list" py="py-s5" className="gap-s4">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-[4px]">
          <h2 className="font-display font-medium text-h3 text-prim leading-none tracking-[-0.02em]">Proposals</h2>
          <p className="font-body text-p2 text-prim/50 leading-none">
            {proposals.length} {proposals.length === 1 ? "proposal" : "proposals"}
          </p>
        </div>
        <NewProposalButton />
      </div>

      {proposals.length === 0 ? (
        <div className="grain bg-surface rounded-lg flex flex-col items-center gap-s2 py-s12 text-center">
          <Text variant="p1" className="text-prim/70">No proposals yet.</Text>
          <Text variant="p3" className="text-prim/40">Create your first one to get started.</Text>
        </div>
      ) : (
        <ul className="flex flex-col gap-s2">
          {proposals.map((p) => (
            <ProposalRow
              key={p.notionPageId}
              notionPageId={p.notionPageId}
              title={p.title || "Untitled proposal"}
              status={p.status}
            />
          ))}
        </ul>
      )}
    </PageShell>
  );
}
