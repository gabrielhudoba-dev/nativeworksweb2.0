import { Heading, Text } from "@/app/components/atoms";
import { PageShell } from "@/app/(app)/components/PageShell";
import { NewProposalForm } from "./NewProposalForm";

export const dynamic = "force-dynamic";

export default async function NewProposalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const clientId   = typeof sp.clientId   === "string" ? sp.clientId   : undefined;
  const clientName = typeof sp.clientName === "string" ? decodeURIComponent(sp.clientName) : undefined;
  const title      = typeof sp.title      === "string" ? decodeURIComponent(sp.title)      : undefined;

  return (
    <PageShell width="form">
      <div className="flex flex-col gap-s1">
        <Heading variant="h3">New proposal</Heading>
        <Text variant="p2" className="text-prim/50">
          Pick the client first, then name the proposal.
        </Text>
      </div>
      <NewProposalForm
        initialClientId={clientId}
        initialClientName={clientName}
        initialTitle={title}
      />
    </PageShell>
  );
}
