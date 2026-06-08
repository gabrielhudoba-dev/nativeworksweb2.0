import { Icon } from "@/app/components/atoms";
import { acceptAction } from "./actions";

/**
 * Closing choice at the end of a proposal: Accept (→ verify → sign) or
 * Discuss (→ Cal.com booking). Server-action form, no client JS required.
 */
export function ProposalCTA({ slug }: { slug: string }) {
  return (
    <section className="flex flex-col gap-s4 pt-s8 border-t border-prim/10">
      <div className="flex flex-col gap-s1">
        <h2 className="font-display font-medium text-h3 text-prim tracking-[-0.02em]">
          Ready to move forward?
        </h2>
        <p className="font-body text-p2 text-prim/55">
          Accept the proposal to confirm details and sign, or book a call to talk it through.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-s2">
        {/* Accept */}
        <form action={acceptAction} className="contents">
          <input type="hidden" name="slug" value={slug} />
          <button
            type="submit"
            className="group grain bg-prim text-white rounded-lg flex flex-col justify-between gap-s8 p-s5 min-h-[180px] text-left hover:opacity-95 transition-opacity cursor-pointer"
          >
            <span className="grid place-items-center size-s6 rounded-pill bg-white/15">
              <Icon name="check" size="md" />
            </span>
            <span className="flex flex-col gap-s1">
              <span className="font-display font-medium text-h4">Accept proposal</span>
              <span className="font-body text-l2 text-white/60">Confirm your details and sign</span>
            </span>
          </button>
        </form>

        {/* Discuss / book a call */}
        <a
          href={`/p/${slug}/book`}
          className="group grain bg-surface rounded-lg flex flex-col justify-between gap-s8 p-s5 min-h-[180px] hover:bg-surface/70 transition-colors"
        >
          <span className="grid place-items-center size-s6 rounded-pill bg-prim/5 text-prim/60">
            <Icon name="person-simple-run" size="md" />
          </span>
          <span className="flex flex-col gap-s1">
            <span className="font-display font-medium text-h4 text-prim">Book a call</span>
            <span className="font-body text-l2 text-prim/50">Talk it through with us first</span>
          </span>
        </a>
      </div>
    </section>
  );
}
