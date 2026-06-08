import { notFound } from "next/navigation";
import { getProposalBySlug } from "@/lib/notion-proposals";
import { getDocuments, prepareDocuments } from "@/lib/esign";
import { buildDocumentData } from "./actions";
import { DocumentsClient } from "./DocumentsClient";

export const dynamic = "force-dynamic";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);
  if (!proposal) notFound();

  let docs = await getDocuments(proposal.notionPageId);

  if (docs.length === 0) {
    const docData = await buildDocumentData(slug);
    if (docData) {
      docs = await prepareDocuments(proposal.notionPageId, docData);
    }
  }

  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK ?? "gabrielhudoba/proposal";
  const isExistingClient = docs.some((d) => !d.isRelationshipDoc && d.documentName.includes("Statement of Work"))
    && !docs.some((d) => d.documentName.includes("NDA"));

  return (
    <main className="mx-auto w-full max-w-form px-s5 py-s12 flex flex-col gap-s6">
      {/* Header */}
      <div className="flex flex-col gap-s2">
        <h1 className="font-display font-medium text-h2 text-prim tracking-[-0.02em]">
          Documents &amp; Signing
        </h1>
        <p className="font-body text-p2 text-prim/55">
          {isExistingClient
            ? "A new Statement of Work has been prepared for your review and signature."
            : "Please review and sign all documents below. Start with the NDA, then the MSA, then the project agreement."}
        </p>
      </div>

      <a
        href={`/p/${slug}`}
        className="self-start inline-flex items-center gap-s1 font-body text-l2 text-prim/40 hover:text-prim transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to proposal
      </a>

      <DocumentsClient slug={slug} initialDocs={docs} calLink={calLink} />
    </main>
  );
}
