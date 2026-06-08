import type { ProposalStatus } from "@/lib/notion-proposals";

/**
 * Status pill for proposal lifecycle states.
 * Colors are self-contained here — proposal status colors are too specific
 * to the app lifecycle to be part of the global brand token set.
 * bg/text use inline Tailwind classes mapped per status.
 */

const STYLE: Record<ProposalStatus, string> = {
  draft:       "bg-prim/8 text-prim/60",
  sent:        "bg-brand/10 text-brand",
  viewed:      "bg-violet-100 text-violet-700",
  call_booked: "bg-orange-100 text-orange-700",
  accepted:    "bg-success-subtle text-success",
  verified:    "bg-yellow-100 text-yellow-700",
  signed:      "bg-success text-white",
  declined:    "bg-error-subtle text-error",
};

const LABEL: Record<ProposalStatus, string> = {
  draft:       "Draft",
  sent:        "Sent",
  viewed:      "Viewed",
  call_booked: "Call booked",
  accepted:    "Accepted",
  verified:    "Verified",
  signed:      "Signed",
  declined:    "Declined",
};

export function StatusBadge({ status }: { status: ProposalStatus }) {
  return (
    <span
      className={`inline-flex items-center h-s3 px-s2 rounded-pill font-body font-medium text-l3 shrink-0 ${STYLE[status]}`}
    >
      {LABEL[status]}
    </span>
  );
}
