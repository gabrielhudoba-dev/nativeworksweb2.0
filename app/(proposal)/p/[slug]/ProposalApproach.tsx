import type { EditorBlock } from "@/app/(app)/tools/blocks/types";

function parseMonths(duration: string): number | null {
  const m = duration?.match(/(\d+(?:\.\d+)?)\s*mo/i);
  if (m) return parseFloat(m[1]);
  const w = duration?.match(/(\d+(?:\.\d+)?)\s*w/i);
  if (w) return parseFloat(w[1]) / 4.33;
  return null;
}

export function ProposalApproach({
  approachBlock,
  pricingBlock,
}: {
  approachBlock: EditorBlock;
  pricingBlock: EditorBlock;
}) {
  const stages = approachBlock.stages;
  const services = pricingBlock.services;

  const currency = services[0]?.price?.match(/[€$£]/)?.[0] ?? "€";
  const vatRaw = pricingBlock.body?.trim() ?? "";
  const vatRate = parseFloat(vatRaw);

  const subtotal = services.reduce((sum, s) => {
    const n = parseFloat(s.price.replace(/[^0-9.]/g, ""));
    if (isNaN(n)) return sum;
    if (s.isRetainer) {
      const mo = parseMonths(s.duration);
      return sum + (mo !== null ? n * mo : n);
    }
    return sum + n;
  }, 0);

  const hasVat = !isNaN(vatRate) && vatRate > 0;
  const vatAmount = hasVat ? subtotal * vatRate / 100 : 0;
  const grandTotal = subtotal + vatAmount;

  return (
    <section className="flex flex-col gap-s2">
      <span className="font-body font-medium text-[10px] text-prim uppercase tracking-widest">
        {approachBlock.heading || "Approach"}
      </span>

      <div className="flex flex-col gap-s6">
        {stages.map((stage, i) => {
          const svc = services[i];
          const months = svc?.isRetainer ? parseMonths(svc.duration) : null;
          const priceNum = svc ? parseFloat(svc.price.replace(/[^0-9.]/g, "")) : NaN;
          const displayPrice = !isNaN(priceNum)
            ? currency + priceNum.toLocaleString("en-US") + (svc?.isRetainer ? "/mo" : "")
            : null;

          return (
            <div key={i} className="relative flex flex-col gap-s1">
              <div className="flex items-center gap-s2 flex-wrap">
                <h3 className="font-display font-medium text-[24px] leading-tight text-prim tracking-[-0.02em]">
                  {stage.title}
                </h3>
              </div>
              <p className="font-body font-normal text-p1 text-prim/70 leading-[1.5] whitespace-pre-wrap">
                {stage.desc}
              </p>

              {svc && (svc.title || svc.price || svc.duration || svc.allocation) && (
                <div className="mt-s2 py-s2 border-y border-prim/15 flex flex-col sm:flex-row sm:items-center gap-[3px] sm:gap-s3">
                  <span className="flex-1 min-w-0 flex items-center gap-[6px]">
                    <span className="font-body font-medium text-l2 text-prim/60 truncate">{svc.title}</span>
                    {svc.isRetainer && (
                      <span className="shrink-0 inline-flex items-center h-s3 px-[6px] rounded bg-brand/8 text-brand text-[10px] font-body font-medium uppercase tracking-wide whitespace-nowrap">
                        Retainer
                      </span>
                    )}
                  </span>
                  <span
                    className="flex items-center gap-s3 w-full sm:w-auto sm:shrink-0"
                    aria-label={
                      [
                        svc.duration,
                        svc.allocation,
                        months !== null && !isNaN(priceNum)
                          ? `€${priceNum.toLocaleString("en-US")} per month, €${(priceNum * months).toLocaleString("en-US")} total`
                          : displayPrice ?? undefined,
                      ]
                        .filter(Boolean)
                        .join(", ") || undefined
                    }
                  >
                    {svc.duration && (
                      <span aria-hidden="true" className="font-body text-l2 text-prim/60 whitespace-nowrap">{svc.duration}</span>
                    )}
                    {svc.allocation && (
                      <span aria-hidden="true" className="font-body text-l2 text-prim/60 whitespace-nowrap">{svc.allocation}</span>
                    )}
                    {displayPrice && (
                      <span aria-hidden="true" className="font-body font-medium text-l2 text-prim whitespace-nowrap ml-auto sm:ml-0">
                        {months !== null
                          ? <>{displayPrice}<span className="font-normal text-prim/60 ml-[6px]">€{(priceNum * months).toLocaleString("en-US")}</span></>
                          : displayPrice}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Totals */}
      {services.length > 0 && (
        <div className="flex flex-col gap-[2px] pt-s2">
          {/* <div className="flex justify-between">
            <span className="font-body text-l2 text-prim/60">Subtotal excl. VAT</span>
            <span className="font-body text-l2 text-prim/60">{currency}{subtotal.toLocaleString("en-US")}</span>
          </div>
          {hasVat && (
            <div className="flex justify-between">
              <span className="font-body text-l2 text-prim/60">VAT · {vatRate}%</span>
              <span className="font-body text-l2 text-prim/60">{currency}{vatAmount.toLocaleString("en-US")}</span>
            </div>
          )} */}
          <div className="flex justify-between pt-s2 mt-s1 border-t-2 border-prim">
            <span className="font-body font-medium text-l1 text-prim">Total</span>
            <span className="font-body font-medium text-l1 text-prim">{currency}{grandTotal.toLocaleString("en-US")}</span>
          </div>
        </div>
      )}
    </section>
  );
}
