import { Heading, Text } from "@/app/components/atoms";
import { PageShell } from "@/app/(app)/components/PageShell";
import { NewProposalForm } from "./NewProposalForm";

export const dynamic = "force-dynamic";

export default function NewProposalPage() {
  return (
    <PageShell width="form">
      <div className="flex flex-col gap-s1">
        <Heading variant="h3">New proposal</Heading>
        <Text variant="p2" className="text-prim/50">
          Pick the client first, then name the proposal.
        </Text>
      </div>
      <NewProposalForm />
    </PageShell>
  );
}
