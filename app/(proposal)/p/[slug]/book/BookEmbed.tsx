"use client";

import { useEffect } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Cal.com element-click embed (popup, month view).
 * The proposal slug is passed as booking metadata so the webhook can match
 * the booking back to this proposal (→ status = call_booked).
 *
 * The button's data-cal-config encodes layout + metadata in one JSON blob.
 */
export function BookEmbed({ calLink, slug }: { calLink: string; slug: string }) {
  // Cal namespace is derived from the event slug segment after the "/".
  const namespace = calLink.split("/")[1] ?? "proposal";

  const calConfig = JSON.stringify({
    layout: "month_view",
    useSlotsViewOnSmallScreen: "true",
    metadata: { proposalSlug: slug },
  });

  useEffect(() => {
    // Element-click embed bootstrap (from Cal.com generated snippet).
    (function (C: any, A: string, L: string) {
      const p = (a: any, ar: any) => a.q.push(ar);
      const d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal;
          const ar = arguments as any;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = function () {
              p(api, arguments);
            };
            const ns = ar[1];
            api.q = api.q || [];
            if (typeof ns === "string") {
              cal.ns[ns] = cal.ns[ns] || api;
              p(cal.ns[ns], ar);
              p(cal, ["initNamespace", ns]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    const Cal = (window as any).Cal;
    Cal("init", namespace, { origin: "https://app.cal.com" });
    Cal.ns[namespace]("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  }, [namespace]);

  return (
    <div className="flex flex-col items-center gap-s6 py-s8">
      <div className="flex flex-col items-center gap-s3 text-center max-w-[480px]">
        <div className="size-s8 rounded-full bg-prim/6 flex items-center justify-center text-[28px]">
          📅
        </div>
        <p className="font-body text-p2 text-prim/70">
          Pick a 15-minute slot and we&apos;ll walk through the proposal together over a call.
        </p>
      </div>

      <button
        type="button"
        data-cal-link={calLink}
        data-cal-namespace={namespace}
        data-cal-config={calConfig}
        className="inline-flex items-center gap-s2 h-s8 px-s6 rounded-pill bg-prim text-white font-body font-semibold text-p2 hover:opacity-85 transition-opacity cursor-pointer"
      >
        Pick a time
      </button>

      <p className="font-body text-l3 text-prim/30">
        Powered by Cal.com · No account needed
      </p>
    </div>
  );
}
