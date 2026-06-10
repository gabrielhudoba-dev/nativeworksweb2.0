"use client";

import { useEffect } from "react";
import { Icon } from "@/app/components/atoms";

/* eslint-disable @typescript-eslint/no-explicit-any */

const CONTACT_EMAIL = "gabo@nativeworks.com";

export function ProposalCTA({
  slug,
  calLink,
  proposalTitle,
}: {
  slug: string;
  calLink: string;
  proposalTitle: string;
}) {
  const namespace = calLink.split("/")[1] ?? "proposal";

  const calConfig = JSON.stringify({
    layout: "month_view",
    useSlotsViewOnSmallScreen: "true",
    metadata: { proposalSlug: slug },
  });

  useEffect(() => {
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
    Cal.ns[namespace]("ui", { hideEventTypeDetails: false, layout: "month_view" });
  }, [namespace]);

  return (
    <section
      className="flex flex-col gap-s4"
    >
      <h2 className="font-display font-medium text-h3 text-prim tracking-[-0.02em]">
        Ready to move forward?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-s2">
        {/* Accept — opens pre-filled email */}
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Accepting proposal — ${proposalTitle}`)}&body=${encodeURIComponent(`Hi,\n\nI'd like to accept the proposal "${proposalTitle}" and kindly request the contract documents for signing.\n\nBest regards,`)}`}
          className="group grain bg-prim text-white rounded-lg flex flex-col justify-between gap-s8 p-s4 min-h-[180px] text-left hover:opacity-95 transition-opacity"
        >
          <span className="grid place-items-center size-s6 rounded-pill bg-white/15">
            <Icon name="check" size="md" />
          </span>
          <span className="flex flex-col gap-0">
            <span className="font-display font-medium text-h4">Agree with proposal</span>
            <span className="font-body text-l2 text-white/60">Send us a message to get started</span>
          </span>
        </a>

        {/* Book a call — opens Cal.com popup directly */}
        <button
          type="button"
          data-cal-link={calLink}
          data-cal-namespace={namespace}
          data-cal-config={calConfig}
          className="group grain bg-surface rounded-lg flex flex-col justify-between gap-s8 p-s4 min-h-[180px] text-left hover:bg-surface/70 transition-colors cursor-pointer"
        >
          <span className="grid place-items-center size-s6 rounded-pill bg-prim/5 text-prim/60">
            <Icon name="question" size="md" />
          </span>
          <span className="flex flex-col gap-0">
            <span className="font-display font-medium text-h4 text-prim">I have questions</span>
            <span className="font-body text-l2 text-prim/65">Let&apos;s jump on a quick call</span>
          </span>
        </button>
      </div>
    </section>
  );
}
