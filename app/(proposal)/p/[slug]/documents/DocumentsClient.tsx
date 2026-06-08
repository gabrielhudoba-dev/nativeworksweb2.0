"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Icon } from "@/app/components/atoms";
import {
  getDocumentsAction,
  viewDocumentAction,
  confirmSignedAction,
} from "./actions";
import type { PreparedDocument } from "@/lib/esign";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Cal.com bootstrap (same as BookEmbed) ─────────────────────────────────────

function useCalEmbed(calLink: string) {
  const namespace = calLink.split("/")[1] ?? "proposal";
  useEffect(() => {
    (function (C: any, A: string, L: string) {
      const p = (a: any, ar: any) => a.q.push(ar);
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal; const ar = arguments as any;
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
        if (ar[0] === L) { const api: any = function () { p(api, arguments); }; const ns = ar[1]; api.q = api.q || []; if (typeof ns === "string") { cal.ns[ns] = cal.ns[ns] || api; p(cal.ns[ns], ar); p(cal, ["initNamespace", ns]); } else { p(cal, ar); } return; }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");
    const Cal = (window as any).Cal;
    Cal("init", namespace, { origin: "https://app.cal.com" });
    Cal.ns[namespace]("ui", { hideEventTypeDetails: false, layout: "month_view" });
  }, [namespace]);
  return namespace;
}

// ── Status helpers ────────────────────────────────────────────────────────────

type DocStatus = PreparedDocument["status"];

const STATUS_CONFIG: Record<DocStatus, { label: string; icon: string; color: string; bg: string }> = {
  preparing: { label: "Preparing…", icon: "spinner",     color: "text-prim/40",  bg: "bg-prim/5"          },
  created:   { label: "Ready",      icon: "file-text",   color: "text-prim/60",  bg: "bg-prim/5"          },
  sent:      { label: "Sent",       icon: "paper-plane",  color: "text-brand/80", bg: "bg-brand/8"         },
  viewed:    { label: "Opened",     icon: "eye",          color: "text-brand",    bg: "bg-brand/8"         },
  signed:    { label: "Signed",     icon: "check",        color: "text-success",  bg: "bg-success-subtle"  },
  declined:  { label: "Declined",   icon: "x",            color: "text-error",    bg: "bg-error-subtle"    },
  error:     { label: "Error",      icon: "warning",      color: "text-error",    bg: "bg-error-subtle"    },
};

function StatusChip({ status }: { status: DocStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.created;
  return (
    <span className={`inline-flex items-center gap-[5px] h-s4 px-s2 rounded-pill font-body font-medium text-l3 shrink-0 ${cfg.bg} ${cfg.color}`}>
      {status === "preparing" ? (
        <span className="size-[10px] border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Icon name={cfg.icon} size="xs" />
      )}
      {cfg.label}
    </span>
  );
}

// ── Individual document card ──────────────────────────────────────────────────

function DocumentCard({
  doc,
  slug,
  onUpdate,
}: {
  doc: PreparedDocument;
  slug: string;
  onUpdate: (d: PreparedDocument) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleOpen() {
    if (!doc.viewUrl) return;
    window.open(doc.viewUrl, "_blank", "noopener");
    // Fire-and-forget view event
    startTransition(async () => {
      await viewDocumentAction(doc.id, slug);
      onUpdate({ ...doc, status: doc.status === "created" ? "viewed" : doc.status });
    });
  }

  function handleConfirmSign() {
    if (!confirming) { setConfirming(true); return; }
    setConfirming(false);
    startTransition(async () => {
      await confirmSignedAction(doc.id, slug);
      onUpdate({ ...doc, status: "signed", signedAt: new Date().toISOString() });
    });
  }

  const canOpen = doc.viewUrl && doc.status !== "preparing";
  const canSign = doc.status === "viewed" || doc.status === "created";

  return (
    <div className="grain bg-surface rounded-xl p-s4 flex flex-col gap-s3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-s3">
        <div className="flex items-center gap-s2 min-w-0">
          <span className="grid place-items-center size-s6 rounded-lg bg-prim/5 text-prim/50 shrink-0">
            <Icon name="file-text" size="md" />
          </span>
          <span className="font-body font-medium text-p3 text-prim truncate">
            {doc.documentName}
          </span>
        </div>
        <StatusChip status={doc.status} />
      </div>

      {/* Actions */}
      {doc.status !== "preparing" && doc.status !== "error" && (
        <div className="flex items-center gap-s2 flex-wrap">
          {/* Open in Drive */}
          {canOpen && (
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex items-center gap-s1 h-s5 px-s2 rounded-md border border-prim/12 font-body text-l2 text-prim/70 hover:border-prim/25 hover:text-prim transition-colors cursor-pointer"
            >
              <Icon name="arrow-square-out" size="xs" />
              Open &amp; read
            </button>
          )}

          {/* Sign */}
          {canSign && doc.status !== "signed" && (
            <button
              type="button"
              onClick={handleConfirmSign}
              disabled={pending}
              className={`inline-flex items-center gap-s1 h-s5 px-s2 rounded-md font-body text-l2 transition-colors cursor-pointer ${
                confirming
                  ? "bg-prim text-white hover:opacity-85"
                  : "border border-brand/30 text-brand hover:border-brand hover:bg-brand/5"
              }`}
            >
              <Icon name={confirming ? "warning" : "pencil-simple"} size="xs" />
              {pending ? "Saving…" : confirming ? "Yes, I have signed it" : "Mark as signed"}
            </button>
          )}

          {doc.status === "signed" && doc.signedAt && (
            <span className="font-body text-l3 text-success flex items-center gap-[5px]">
              <Icon name="check-circle" size="xs" />
              Signed {new Date(doc.signedAt).toLocaleDateString("sk-SK")}
            </span>
          )}
        </div>
      )}

      {doc.status === "error" && (
        <p className="font-body text-l3 text-error">
          Could not generate this document. Please contact us.
        </p>
      )}
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ docs }: { docs: PreparedDocument[] }) {
  const total  = docs.length;
  const signed = docs.filter((d) => d.status === "signed").length;
  const viewed = docs.filter((d) => d.status === "viewed").length;
  if (total === 0) return null;

  return (
    <div className="flex flex-col gap-s1">
      <div className="flex items-center justify-between">
        <span className="font-body text-l2 text-prim/60">
          {signed === total
            ? "All documents signed ✓"
            : `${signed} of ${total} signed${viewed > 0 ? ` · ${viewed} opened` : ""}`}
        </span>
        <span className="font-body text-l3 text-prim/35">{Math.round((signed / total) * 100)}%</span>
      </div>
      <div className="h-[4px] rounded-full bg-prim/8 overflow-hidden">
        <div
          className="h-full bg-success rounded-full transition-all duration-500"
          style={{ width: `${(signed / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function DocumentsClient({
  slug,
  initialDocs,
  calLink,
}: {
  slug: string;
  initialDocs: PreparedDocument[];
  calLink: string;
}) {
  const [docs, setDocs] = useState<PreparedDocument[]>(initialDocs);
  const calNamespace = useCalEmbed(calLink);
  const calConfig = JSON.stringify({
    layout: "month_view",
    useSlotsViewOnSmallScreen: "true",
    metadata: { proposalSlug: slug },
  });

  // Poll every 4s while any doc is still preparing
  const preparing = docs.some((d) => d.status === "preparing");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!preparing) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(async () => {
      const fresh = await getDocumentsAction(slug);
      if (fresh.length > 0) setDocs(fresh);
      if (!fresh.some((d) => d.status === "preparing")) {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [preparing, slug]);

  function updateDoc(updated: PreparedDocument) {
    setDocs((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  }

  const allSigned = docs.length > 0 && docs.every((d) => d.status === "signed");

  return (
    <div className="flex flex-col gap-s6">
      {/* ── Progress ─────────────────────────────────────────────────────── */}
      {docs.length > 0 && <ProgressBar docs={docs} />}

      {/* ── Document cards ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-s2">
        {docs.length === 0 ? (
          // Skeleton while server prepares
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="grain bg-surface rounded-xl p-s4 flex items-center gap-s3 animate-pulse">
              <div className="size-s6 rounded-lg bg-prim/8 shrink-0" />
              <div className="flex-1 h-[14px] rounded-full bg-prim/8" />
              <div className="w-16 h-s4 rounded-pill bg-prim/8" />
            </div>
          ))
        ) : (
          docs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} slug={slug} onUpdate={updateDoc} />
          ))
        )}
      </div>

      {/* ── All signed confirmation ───────────────────────────────────────── */}
      {allSigned && (
        <div className="flex items-center gap-s3 p-s4 rounded-xl bg-success-subtle border border-success/20">
          <span className="grid place-items-center size-s6 rounded-full bg-success text-white shrink-0">
            <Icon name="check" size="md" />
          </span>
          <div className="flex flex-col">
            <span className="font-body font-medium text-p3 text-success">All signed</span>
            <span className="font-body text-l3 text-success/70">
              We&apos;ll follow up with next steps shortly.
            </span>
          </div>
        </div>
      )}

      {/* ── Still have questions / Book a call ───────────────────────────── */}
      <div className="pt-s4 border-t border-prim/8 flex flex-col gap-s3">
        <div className="flex flex-col gap-s1">
          <span className="font-body font-medium text-l1 text-prim/70">Still have questions?</span>
          <span className="font-body text-l3 text-prim/40">
            Book a 15-minute call to discuss the contract before signing.
          </span>
        </div>
        <button
          type="button"
          data-cal-link={calLink}
          data-cal-namespace={calNamespace}
          data-cal-config={calConfig}
          className="self-start inline-flex items-center gap-s2 h-s6 px-s3 rounded-pill border border-prim/15 font-body text-l2 text-prim/70 hover:border-prim/30 hover:text-prim transition-colors cursor-pointer"
        >
          <Icon name="calendar" size="sm" />
          Book a call
        </button>
      </div>
    </div>
  );
}
