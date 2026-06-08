import { Heading, Text } from "@/app/components/atoms";
import { NewProposalForm } from "./NewProposalForm";

export const dynamic = "force-dynamic";

export default function NewProposalPage() {
  return (
    <div className="mx-auto w-full max-w-[560px] px-s4 py-s10 flex flex-col gap-s6">
      <div className="flex flex-col gap-s1">
        <Heading variant="h3">New proposal</Heading>
        <Text variant="p2" className="text-prim/50">
          Pick the client first, then name the proposal.
        </Text>
      </div>
      <NewProposalForm />
    </div>
  );
}
