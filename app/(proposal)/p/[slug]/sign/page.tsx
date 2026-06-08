import { notFound } from "next/navigation";
import { getProposalBySlug } from "@/lib/notion-proposals";
import { signAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function SignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);
  if (!proposal) notFound();

  if (proposal.status === "signed") {
    return (
      <main className="mx-auto w-full max-w-[560px] px-s5 py-s16 flex flex-col items-center gap-s3 text-center">
        <h1 className="font-display font-medium text-h2 text-prim">Already signed</h1>
        <a href={`/p/${slug}`} className="font-body text-l1 text-brand hover:opacity-70">
          View proposal
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[560px] px-s5 py-s12 flex flex-col gap-s6">
      <div className="flex flex-col gap-s2">
        <h1 className="font-display font-medium text-h2 text-prim tracking-[-0.02em]">Sign</h1>
        <p className="font-body text-p2 text-prim/55">
          By typing your full name and confirming, you agree to the terms of{" "}
          <span className="text-prim">{proposal.title}</span>.
        </p>
      </div>

      <form action={signAction} className="flex flex-col gap-s4">
        <input type="hidden" name="slug" value={slug} />
        <label className="flex flex-col gap-s1">
          <span className="font-body font-medium text-l2 text-prim/70">Full legal name</span>
          <input
            name="fullName"
            required
            autoComplete="name"
            placeholder="Jane Doe"
            className="h-s8 px-s3 rounded-md border border-prim/15 bg-white font-display text-h4 text-prim outline-none focus:border-brand transition-colors"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center h-s8 px-s5 rounded-pill bg-prim text-white font-body font-medium text-l1 hover:opacity-85 transition-opacity"
        >
          Sign &amp; accept
        </button>
        <p className="font-body text-l3 text-prim/40">
          Interim signing. Google Workspace eSignature integration is coming.
        </p>
      </form>
    </main>
  );
}
