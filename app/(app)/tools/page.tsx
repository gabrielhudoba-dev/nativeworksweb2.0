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
    <span className={`inline-flex items-center h-s3 px-s2 rounded-pill font-body font-medium text-l3 uppercase tracking-wide ${STATUS_STYLE[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default async function StudioPage() {
  const proposals = await listProposals();

  return (
    <div className="mx-auto w-full max-w-[880px] px-s4 py-s5 flex flex-col gap-s4">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-[4px]">
          <h2 className="font-display font-medium text-h3 text-prim leading-none tracking-[-0.02em]">Proposals</h2>
          <p className="font-body text-p2 text-prim/50 leading-none">
            {proposals.length} {proposals.length === 1 ? "proposal" : "proposals"}
          </p>
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
            <li key={p.notionPageId} className="grain group relative flex items-center gap-s2 rounded-[12px] bg-surface hover:brightness-[0.97] transition-all">
              {/* Full-card link to editor (z-0, invisible overlay) */}
              <Link href={`/tools/proposals/${p.notionPageId}/edit`} className="absolute inset-0 z-0 rounded-[12px]" aria-label={p.title || "Untitled proposal"} />
              {/* Card content — above the overlay */}
              <div className="relative z-10 flex-1 flex items-center justify-between gap-s4 p-s4 min-w-0">
                <div className="flex flex-col gap-0 min-w-0">
                  <Text variant="p1" className="text-prim truncate">
                    {p.title || "Untitled proposal"}
                  </Text>
                  <a
                    href={`/p/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit relative z-20"
                  >
                    <Text variant="l3" className="text-prim/40 hover:text-prim/70 transition-colors">/p/{p.slug}</Text>
                  </a>
                </div>
                <StatusPill status={p.status} />
              </div>
              {/* Three-dot context menu */}
              <div className="pr-s2 relative z-10">
                <ProposalRowMenu proposalPageId={p.notionPageId} title={p.title || "Untitled proposal"} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
