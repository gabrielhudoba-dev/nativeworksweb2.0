"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/app/components/atoms";

/* eslint-disable @typescript-eslint/no-explicit-any */

const CONTACT_EMAIL = "gabo@nativeworks.com";
const PIN_BOTTOM = 64; // px from viewport bottom

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

  const sectionRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    const spacer = spacerRef.current;
    if (!el || !spacer) return;

    let gsap: any = null;
    let isPinned = false;

    import("gsap").then((m) => { gsap = m.gsap ?? m.default; });

    const pin = () => {
      const rect = el.getBoundingClientRect();
      // Spacer takes element's place in flow
      spacer.style.height = `${rect.height}px`;
      spacer.style.display = "block";
      // Fix element to bottom
      el.style.position = "fixed";
      el.style.bottom = `${PIN_BOTTOM}px`;
      el.style.top = "auto";
      el.style.left = `${rect.left}px`;
      el.style.width = `${rect.width}px`;
      el.style.zIndex = "40";
      isPinned = true;

      // Entry animation on inner content
      if (gsap) {
        gsap.fromTo(el,
          { y: 32, opacity: 0.5 },
          { y: 0, opacity: 1, duration: 1.0, ease: "expo.out", clearProps: "opacity" }
        );
      }
    };

    const unpin = () => {
      el.style.cssText = "";
      spacer.style.display = "none";
      isPinned = false;
      if (gsap) gsap.set(el, { clearProps: "all" });
    };

    const onScroll = () => {
      if (isPinned) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom <= window.innerHeight - PIN_BOTTOM) {
        pin();
      }
    };

    // Elastic resistance — scroll down blocked, scroll up unpins
    const onWheel = (e: WheelEvent) => {
      if (!isPinned) return;
      e.preventDefault();
      if (e.deltaY < 0) {
        // Scroll up → release pin
        unpin();
        return;
      }
      // Scroll down → elastic bounce
      if (!gsap) return;
      gsap.killTweensOf(el);
      gsap.to(el, {
        y: 18,
        duration: 0.22,
        ease: "sine.out",
        overwrite: true,
        onComplete: () =>
          gsap.to(el, { y: 0, duration: 1.6, ease: "elastic.out(1, 0.4)", overwrite: true }),
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    onScroll(); // check on mount

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      unpin();
    };
  }, []);

  return (
    <>
      <div ref={spacerRef} style={{ display: "none" }} aria-hidden />
      <section ref={sectionRef} className="flex flex-col gap-s4 bg-white">
        <h2 className="font-display font-medium text-h3 text-prim tracking-[-0.02em]">
          Ready to move forward?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-s2">
          {/* Accept — opens pre-filled email */}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Accepting proposal — ${proposalTitle}`)}&body=${encodeURIComponent(`Hi,\n\nI'd like to accept the proposal "${proposalTitle}" and kindly request the contract documents for signing.\n\nBest regards,`)}`}
            className="group grain bg-prim text-white rounded-lg flex flex-col justify-between gap-s8 p-s5 min-h-[180px] text-left hover:opacity-95 transition-opacity"
          >
            <span className="grid place-items-center size-s6 rounded-pill bg-white/15">
              <Icon name="check" size="md" />
            </span>
            <span className="flex flex-col gap-s1">
              <span className="font-display font-medium text-h4">Accept proposal</span>
              <span className="font-body text-l2 text-white/60">Send us a message to get started</span>
            </span>
          </a>

          {/* Book a call — opens Cal.com popup directly */}
          <button
            type="button"
            data-cal-link={calLink}
            data-cal-namespace={namespace}
            data-cal-config={calConfig}
            className="group grain bg-surface rounded-lg flex flex-col justify-between gap-s8 p-s5 min-h-[180px] text-left hover:bg-surface/70 transition-colors cursor-pointer"
          >
            <span className="grid place-items-center size-s6 rounded-pill bg-prim/5 text-prim/60">
              <Icon name="person-simple-run" size="md" />
            </span>
            <span className="flex flex-col gap-s1">
              <span className="font-display font-medium text-h4 text-prim">I have questions</span>
              <span className="font-body text-l2 text-prim/50">Let&apos;s jump on a quick call</span>
            </span>
          </button>
        </div>
      </section>
    </>
  );
}
