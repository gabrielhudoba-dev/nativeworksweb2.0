import { notFound } from "next/navigation";
import { getProposalBySlug } from "@/lib/notion-proposals";
import { getClient, type NotionClient } from "@/lib/notion-clients";
import { verifyAction } from "./actions";

export const dynamic = "force-dynamic";

function Field({
  name,
  label,
  defaultValue,
  type = "text",
  required,
  full,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-s1 ${full ? "sm:col-span-2" : ""}`}>
      <span className="font-body font-medium text-l2 text-prim/70">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="h-s7 px-s3 rounded-md border border-prim/15 bg-white font-body text-p2 text-prim outline-none focus:border-brand transition-colors"
      />
    </label>
  );
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);
  if (!proposal) notFound();

  const client: NotionClient | null = proposal.clientPageId
    ? await getClient(proposal.clientPageId)
    : null;

  return (
    <main className="mx-auto w-full max-w-[640px] px-s5 py-s12 flex flex-col gap-s6">
      <div className="flex flex-col gap-s2">
        <a href={`/p/${slug}`} className="font-body text-l2 text-prim/40 hover:text-prim transition-colors">
          ← Back to proposal
        </a>
        <h1 className="font-display font-medium text-h2 text-prim tracking-[-0.02em]">
          Confirm your details
        </h1>
        <p className="font-body text-p2 text-prim/55">
          We need these for the contract and invoicing. Please review and complete anything missing.
        </p>
      </div>

      <form action={verifyAction} className="flex flex-col gap-s5">
        <input type="hidden" name="slug" value={slug} />

        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-s3">
          <Field name="companyName" label="Company name" defaultValue={client?.companyName} required full />
          <Field name="legalName" label="Legal company name" defaultValue={client?.legalName} />
          <Field name="regId" label="Company reg. no. (IČO)" defaultValue={client?.regId} />
          <Field name="vatId" label="Tax ID / VAT (DIČ)" defaultValue={client?.vatId} />
          <Field name="signatoryName" label="Signatory name" defaultValue={client?.signatoryName} required />
          <Field name="billingEmail" label="Billing email" type="email" defaultValue={client?.billingEmail} required />
          <Field name="address" label="Billing address" defaultValue={client?.address} required full />
        </fieldset>

        {!client && (
          <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-s3 pt-s3 border-t border-prim/10">
            <Field name="contactName" label="Contact name" full />
            <Field name="contactEmail" label="Contact email" type="email" />
            <Field name="contactPhone" label="Contact phone" type="tel" />
          </fieldset>
        )}

        <div className="flex items-center gap-s3">
          <button
            type="submit"
            className="inline-flex items-center h-s7 px-s5 rounded-pill bg-prim text-white font-body font-medium text-l1 hover:opacity-85 transition-opacity"
          >
            Confirm &amp; continue
          </button>
          <span className="font-body text-l3 text-prim/40">Next: review &amp; sign</span>
        </div>
      </form>
    </main>
  );
}
