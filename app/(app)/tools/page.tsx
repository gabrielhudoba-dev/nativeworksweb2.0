import Link from "next/link";
import { listProposals, type ProposalStatus } from "@/lib/notion-proposals";
import { Heading, Text } from "@/app/components/atoms";
import { ProposalRowMenu } from "./proposals/ProposalRowMenu";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<ProposalStatus, string> = {
  draft:       "bg-prim/8 text-prim/60",
  sent:        "bg-brand/10 text-brand",
  viewed:      "bg-purple-100 text-purple-700",
  call_booked: "bg-orange-100 text-orange-700",
  accepted:    "bg-green-100 text-green-700",
  verified:    "bg-yellow-100 text-yellow-800",
  signed:      "bg-green-600 text-white",
  declined:    "bg-red-100 text-red-700",
};

function StatusPill({ status }: { status: ProposalStatus }) {
  return (
    <span className={`inline-flex items-center h-s3 px-s2 rounded-pill font-body font-medium text-l3 ${STATUS_STYLE[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default async function StudioPage() {
  const proposals = await listProposals();

  return (
    <div className="mx-auto w-full max-w-[880px] px-s4 py-s8 flex flex-col gap-s6">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-s1">
          <Heading variant="h3">Proposals</Heading>
          <Text variant="p2" className="text-prim/50">
            {proposals.length} {proposals.length === 1 ? "proposal" : "proposals"}
          </Text>
        </div>
        <Link
          href="/tools/proposals/new"
          className="inline-flex items-center h-s7 px-s4 rounded-pill bg-prim text-white font-body font-medium text-l1 hover:opacity-85 transition-opacity"
        >
          New proposal
        </Link>
      </div>

      {proposals.length === 0 ? (
        <div className="grain bg-surface rounded-lg flex flex-col items-center gap-s2 py-s12 text-center">
          <Text variant="p1" className="text-prim/70">No proposals yet.</Text>
          <Text variant="p3" className="text-prim/40">Create your first one to get started.</Text>
        </div>
      ) : (
        <ul className="flex flex-col gap-s2">
          {proposals.map((p) => (
            <li key={p.notionPageId} className="group relative flex items-center gap-s2 rounded-lg border border-prim/8 hover:border-prim/20 hover:bg-surface/60 transition-colors">
              {/* Clickable area → editor */}
              <Link
                href={`/tools/proposals/${p.notionPageId}/edit`}
                className="flex-1 flex items-center justify-between gap-s4 p-s4 min-w-0"
              >
                <div className="flex flex-col gap-s1 min-w-0">
                  <Text variant="p1" className="text-prim truncate">
                    {p.title || "Untitled proposal"}
                  </Text>
                  <Text variant="l3" className="text-prim/40">/p/{p.slug}</Text>
                </div>
                <StatusPill status={p.status} />
              </Link>
              {/* Three-dot context menu — rendered outside the Link */}
              <div className="pr-s2">
                <ProposalRowMenu proposalPageId={p.notionPageId} title={p.title || "Untitled proposal"} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
