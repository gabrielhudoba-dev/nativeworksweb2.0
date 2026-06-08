"use client";

/**
 * Block registry — the single source of truth for how each proposal block looks.
 * Exactly one `Render` per block type, used by BOTH the editor (mode="edit") and
 * the public proposal view (mode="view"). Same component → same pixels → WYSIWYG
 * by construction.
 */

import { useEffect, useRef, useState } from "react";
import { Text, Icon, Logo } from "@/app/components/atoms";
import { EditableText } from "@/app/components/atoms/EditableText";
import { searchClientsAction, changeProposalClientAction, getCatalogServicesAction } from "@/app/(app)/tools/proposals/actions";
import type { BlockType, EditorBlock, EditorService, EditorStage } from "./types";

export type BlockMode = "edit" | "view";

export type RenderProps = {
  block: EditorBlock;
  mode: BlockMode;
  onChange?: (patch: Partial<EditorBlock>) => void;
  /** Editor only — needed by HeaderBlock for the inline client picker. */
  proposalPageId?: string;
};

// ─── Small edit-only controls ─────────────────────────────────────────────────

function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="shrink-0 grid place-items-center size-s4 rounded-pill bg-prim/5 text-prim/50 hover:bg-prim/10 hover:text-prim transition-colors cursor-pointer"
    >
      <Icon name="close" size="sm" />
    </button>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-s1 text-l2 text-brand hover:opacity-70 transition-opacity cursor-pointer"
    >
      <span className="grid place-items-center size-s3 rounded-pill bg-brand/10 text-brand">
        <Icon name="plus" size="sm" />
      </span>
      {children}
    </button>
  );
}

// ─── Renderers ─────────────────────────────────────────────────────────────────

type ClientResult = { pageId: string; companyName: string };

function ClientPicker({
  clientName,
  proposalPageId,
  onChange,
}: {
  clientName: string;
  proposalPageId: string;
  onChange: (name: string, pageId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ClientResult[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) { setQuery(""); setResults([]); return; }
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    if (!open || query.trim().length < 1) { setResults([]); return; }
    setSearching(true);
    const t = setTimeout(async () => {
      try { setResults(await searchClientsAction(query)); }
      finally { setSearching(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [query, open]);

  function pick(c: ClientResult) {
    onChange(c.companyName, c.pageId);
    setOpen(false);
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center font-display font-medium text-[48px] sm:text-[72px] text-prim leading-[1.02] tracking-[-0.03em] hover:text-brand transition-colors cursor-pointer"
      >
        {clientName || "Client"}
      </button>

      {open && (
        <>
          <span className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <span className="absolute z-40 top-[calc(100%+6px)] left-0 w-[280px] flex flex-col rounded-lg bg-white border border-prim/12 shadow-lg overflow-hidden tracking-normal">
            <span className="flex items-center gap-s1 px-s2 py-s2 border-b border-prim/8">
              <Icon name="magnifying-glass" size="sm" className="text-prim/35 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search clients…"
                className="flex-1 font-body text-l1 text-prim bg-transparent outline-none placeholder:text-prim/30"
              />
            </span>
            {results.map((c) => (
              <button
                key={c.pageId}
                type="button"
                onClick={() => pick(c)}
                className="text-left px-s3 py-s2 font-body text-p3 text-prim hover:bg-surface transition-colors cursor-pointer"
              >
                {c.companyName}
              </button>
            ))}
            {query.trim().length > 0 && !searching && results.length === 0 && (
              <span className="px-s3 py-s2 font-body text-l1 text-prim/40">No clients found</span>
            )}
            {query.trim().length === 0 && (
              <span className="px-s3 py-s2 font-body text-l1 text-prim/40">Type to search…</span>
            )}
          </span>
        </>
      )}
    </span>
  );
}

function HeaderBlock({ block, mode, onChange, proposalPageId }: RenderProps) {
  const subtitle = block.subtitle || "0001";
  const clientName = block.clientName;

  return (
    <header className="flex flex-col gap-s3 pb-s4">
      <Logo size="md" />
      <h1 className="font-display font-medium text-[48px] sm:text-[72px] text-prim leading-[1.02] tracking-[-0.03em] flex items-baseline gap-[0.18em] flex-wrap">
        <span className="text-prim/30 inline-flex items-baseline">
          <span>#</span>
          <EditableText
            mode={mode}
            as="span"
            value={block.subtitle || "0001"}
            onChange={(v) => onChange?.({ subtitle: v })}
            placeholder="0001"
            className="text-prim/30"
          />
        </span>
        {(clientName || mode === "edit") && (
          <>
            {mode === "edit" && proposalPageId ? (
              <ClientPicker
                clientName={clientName}
                proposalPageId={proposalPageId}
                onChange={(name, pageId) => {
                  onChange?.({ clientName: name });
                  changeProposalClientAction(proposalPageId, pageId).catch(console.error);
                }}
              />
            ) : (
              <span>{clientName}</span>
            )}
            <span className="text-prim/20"> — </span>
          </>
        )}
        <EditableText
          mode={mode}
          as="span"
          value={block.heading}
          onChange={(v) => onChange?.({ heading: v })}
          placeholder="Project Title"
          className="font-display font-medium text-[48px] sm:text-[72px] text-prim leading-[1.02] tracking-[-0.03em]"
        />
      </h1>
    </header>
  );
}

function TextBlock({ block, mode, onChange }: RenderProps) {
  return (
    <section className="flex flex-col gap-s3">
      <EditableText
        mode={mode}
        as="h2"
        value={block.heading}
        onChange={(v) => onChange?.({ heading: v })}
        placeholder="Heading"
        className="font-body font-medium text-[10px] text-prim uppercase tracking-widest"
      />
      <EditableText
        mode={mode}
        as="p"
        value={block.body}
        onChange={(v) => onChange?.({ body: v })}
        placeholder="Write something…"
        className="font-body font-normal text-p1 text-prim/80 leading-[1.5] whitespace-pre-wrap"
      />
    </section>
  );
}

/** Executive Summary — small label + large 24px paragraph body. */
function ExecutiveSummaryBlock({ block, mode, onChange }: RenderProps) {
  return (
    <section className="flex flex-col gap-s3">
      <EditableText
        mode={mode}
        as="span"
        value={block.heading}
        onChange={(v) => onChange?.({ heading: v })}
        placeholder="Executive Summary"
        className="font-body font-medium text-[10px] text-prim uppercase tracking-widest"
      />
      <EditableText
        mode={mode}
        as="p"
        value={block.body}
        onChange={(v) => onChange?.({ body: v })}
        placeholder="Write a concise summary…"
        className="font-body font-normal text-[24px] leading-[1.45] text-prim whitespace-pre-wrap"
      />
    </section>
  );
}

/** Approach — small section label + sub-sections, each with title, duration badge, body. */
function ApproachBlock({ block, mode, onChange }: RenderProps) {
  const stages = block.stages;
  const setStage = (i: number, patch: Partial<EditorStage>) => {
    const next = stages.map((s, j) => (j === i ? { ...s, ...patch } : s));
    onChange?.({ stages: next });
  };
  const removeStage = (i: number) => onChange?.({ stages: stages.filter((_, j) => j !== i) });
  const addStage = () =>
    onChange?.({
      stages: [...stages, { title: "New Phase", duration: "2 weeks", desc: "" }],
    });

  return (
    <section className="flex flex-col gap-s5">
      <EditableText
        mode={mode}
        as="span"
        value={block.heading}
        onChange={(v) => onChange?.({ heading: v })}
        placeholder="Approach"
        className="font-body font-medium text-[10px] text-prim uppercase tracking-widest"
      />
      <div className="flex flex-col gap-s6">
        {stages.map((stage, i) => (
          <div key={i} className="relative flex flex-col gap-s1 pl-s5 border-l-2 border-prim/10">
            {mode === "edit" && (
              <div className="absolute top-0 right-0">
                <RemoveButton onClick={() => removeStage(i)} label="Remove phase" />
              </div>
            )}
            <div className="flex items-center gap-s2 flex-wrap">
              <EditableText
                mode={mode}
                as="h3"
                value={stage.title}
                onChange={(v) => setStage(i, { title: v })}
                placeholder="Phase title"
                className="font-display font-medium text-[24px] leading-tight text-prim tracking-[-0.02em]"
              />
              <EditableText
                mode={mode}
                as="span"
                value={stage.duration ?? ""}
                onChange={(v) => setStage(i, { duration: v })}
                placeholder="Duration"
                className="inline-flex items-center h-s4 px-s2 rounded-pill bg-prim/6 font-body text-l3 text-prim/50"
              />
            </div>
            <EditableText
              mode={mode}
              as="p"
              value={stage.desc}
              onChange={(v) => setStage(i, { desc: v })}
              placeholder="Describe this phase…"
              className="font-body font-normal text-p1 text-prim/70 leading-[1.5] whitespace-pre-wrap"
            />
          </div>
        ))}
      </div>
      {mode === "edit" && <AddButton onClick={addStage}>Add phase</AddButton>}
    </section>
  );
}

/** CTA — the accept / book-a-call closing section. */
function CtaBlock({ block, mode, onChange }: RenderProps) {
  void block; void onChange;

  if (mode === "edit") {
    return (
      <section className="flex flex-col gap-s4">
        <h2 className="font-display font-medium text-h3 text-prim tracking-[-0.02em]">
          Ready to move forward?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-s2">
          <div className="rounded-lg bg-prim/[0.04] min-h-[100px] flex items-center justify-center">
            <span className="font-body text-l3 text-prim/25 uppercase tracking-widest">Accept proposal</span>
          </div>
          <div className="rounded-lg bg-prim/[0.04] min-h-[100px] flex items-center justify-center">
            <span className="font-body text-l3 text-prim/25 uppercase tracking-widest">I have questions</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-s4">
      <h2 className="font-display font-medium text-h3 text-prim tracking-[-0.02em]">
        Ready to move forward?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-s2">
        <div className="grain bg-prim text-white rounded-lg flex flex-col justify-between gap-s8 p-s5 min-h-[160px]">
          <span className="grid place-items-center size-s6 rounded-pill bg-white/15 w-fit">
            <Icon name="check" size="md" />
          </span>
          <span className="flex flex-col gap-s1">
            <span className="font-display font-medium text-h4">Accept proposal</span>
            <span className="font-body text-l2 text-white/60">Send us a message to get started</span>
          </span>
        </div>
        <div className="grain bg-surface rounded-lg flex flex-col justify-between gap-s8 p-s5 min-h-[160px]">
          <span className="grid place-items-center size-s6 rounded-pill bg-prim/5 text-prim/60 w-fit">
            <Icon name="person-simple-run" size="md" />
          </span>
          <span className="flex flex-col gap-s1">
            <span className="font-display font-medium text-h4 text-prim">I have questions</span>
            <span className="font-body text-l2 text-prim/50">Let&apos;s jump on a quick call</span>
          </span>
        </div>
      </div>
    </section>
  );
}

/** Partnership & Governance — two-column: heading left, paragraph right. */
function PartnershipBlock({ block, mode, onChange }: RenderProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-s5 sm:gap-s8">
      <EditableText
        mode={mode}
        as="h2"
        value={block.heading}
        onChange={(v) => onChange?.({ heading: v })}
        placeholder="Partnership & Governance Structure"
        className="font-display font-medium text-h3 text-prim tracking-[-0.02em] leading-tight"
      />
      <EditableText
        mode={mode}
        as="p"
        value={block.body}
        onChange={(v) => onChange?.({ body: v })}
        placeholder="Describe your delivery governance and partnership model…"
        className="font-body font-normal text-p2 text-prim/70 leading-[1.6] whitespace-pre-wrap"
      />
    </section>
  );
}

/** About Native Works — standard studio description. */
function AboutBlock({ block, mode, onChange }: RenderProps) {
  return (
    <section className="flex flex-col gap-s3">
      <EditableText
        mode={mode}
        as="h2"
        value={block.heading}
        onChange={(v) => onChange?.({ heading: v })}
        placeholder="About Native Works"
        className="font-body font-medium text-[10px] text-prim uppercase tracking-widest"
      />
      <EditableText
        mode={mode}
        as="p"
        value={block.body}
        onChange={(v) => onChange?.({ body: v })}
        placeholder="Studio description…"
        className="font-body font-normal text-p1 text-prim/80 leading-[1.5] whitespace-pre-wrap"
      />
    </section>
  );
}

/** Footer — locked, non-editable in the rendered proposal. */
function FooterBlock({ block }: RenderProps) {
  void block;
  return (
    <footer className="grain bg-brand/10 rounded-xl px-s6 py-s6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-s4">
      <div className="flex flex-col gap-s3">
        <Logo size="md" />
        <span className="font-body text-p3 text-prim/50">New era of digital product design.</span>
      </div>
      <div className="flex flex-col gap-s1 text-right">
        <span className="font-body text-l3 text-prim/50">hello@nativeworks.com</span>
        <span className="font-body text-l3 text-prim/50">nativeworks.com</span>
        <span className="font-body text-l3 text-prim/35">© 2025 Native Works</span>
      </div>
    </footer>
  );
}

function ListBlock({ block, mode, onChange }: RenderProps) {
  const items = block.items;
  const setItem = (i: number, v: string) => {
    const next = items.slice();
    next[i] = v;
    onChange?.({ items: next });
  };
  const removeItem = (i: number) => onChange?.({ items: items.filter((_, j) => j !== i) });
  const addItem = () => onChange?.({ items: [...items, ""] });

  return (
    <section className="flex flex-col gap-s3">
      <EditableText
        mode={mode}
        as="h2"
        value={block.heading}
        onChange={(v) => onChange?.({ heading: v })}
        placeholder="Heading"
        className="font-body font-medium text-[10px] text-prim uppercase tracking-widest"
      />
      <ul className="flex flex-col gap-s2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-s2">
            <span className="grid place-items-center size-s3 mt-[2px] shrink-0 rounded-pill bg-brand/10 text-brand">
              <Icon name="check" size="sm" />
            </span>
            <EditableText
              mode={mode}
              as="span"
              value={item}
              onChange={(v) => setItem(i, v)}
              placeholder="List item"
              className="flex-1 font-body font-normal text-p2 text-prim/80 leading-[1.5]"
            />
            {mode === "edit" && <RemoveButton onClick={() => removeItem(i)} label="Remove item" />}
          </li>
        ))}
      </ul>
      {mode === "edit" && <AddButton onClick={addItem}>Add item</AddButton>}
    </section>
  );
}

function ProcessBlock({ block, mode, onChange }: RenderProps) {
  const stages = block.stages;
  const setStage = (i: number, patch: Partial<EditorStage>) => {
    const next = stages.map((s, j) => (j === i ? { ...s, ...patch } : s));
    onChange?.({ stages: next });
  };
  const removeStage = (i: number) => onChange?.({ stages: stages.filter((_, j) => j !== i) });
  const addStage = () => onChange?.({ stages: [...stages, { title: "Stage", desc: "" }] });

  return (
    <section className="flex flex-col gap-s4">
      <EditableText
        mode={mode}
        as="h2"
        value={block.heading}
        onChange={(v) => onChange?.({ heading: v })}
        placeholder="Process"
        className="font-display font-medium text-h3 text-prim tracking-[-0.02em]"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-s2">
        {stages.map((stage, i) => (
          <div key={i} className="grain relative bg-surface rounded-lg flex flex-col gap-s2 p-s4">
            {mode === "edit" && (
              <div className="absolute top-s2 right-s2 z-10">
                <RemoveButton onClick={() => removeStage(i)} label="Remove stage" />
              </div>
            )}
            <Text variant="l3" as="span" className="text-prim/40">{String(i + 1).padStart(2, "0")}</Text>
            <EditableText
              mode={mode}
              as="h3"
              value={stage.title}
              onChange={(v) => setStage(i, { title: v })}
              placeholder="Stage title"
              className="font-display font-medium text-h4 text-prim"
            />
            <EditableText
              mode={mode}
              as="p"
              value={stage.desc}
              onChange={(v) => setStage(i, { desc: v })}
              placeholder="What happens in this stage"
              className="font-body font-normal text-p2 text-prim/70 leading-[1.5]"
            />
          </div>
        ))}
      </div>
      {mode === "edit" && <AddButton onClick={addStage}>Add stage</AddButton>}
    </section>
  );
}

function parseMonths(duration: string): number | null {
  const m = duration.match(/(\d+)\s*mo(nth)?s?/i);
  return m ? parseInt(m[1], 10) : null;
}

/** Format a price string with US comma separators: "€1000" → "€1,000", "€5K" → "€5K". */
function formatPrice(val: string): string {
  const m = val.trim().match(/^([€$£]?)(\d[\d\s,.]*)([KkMm]?)$/);
  if (!m) return val;
  const [, sym, num, suffix] = m;
  const clean = parseFloat(num.replace(/[\s,]/g, ""));
  if (isNaN(clean)) return val;
  return sym + clean.toLocaleString("en-US") + suffix.toUpperCase();
}

type CatalogService = { id: number; title: string; desc: string; price: string; duration: string };

function ServiceNameCell({
  value,
  onCommit,
}: {
  value: string;
  onCommit: (patch: Partial<EditorService>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [catalog, setCatalog] = useState<CatalogService[]>([]);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    setOpen(true);
    if (!loaded) {
      getCatalogServicesAction().then((rows) => { setCatalog(rows); setLoaded(true); });
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function pick(c: CatalogService) {
    onCommit({ title: c.title, desc: c.desc, price: c.price, duration: c.duration });
    setOpen(false);
  }

  return (
    <span className="relative flex-1 min-w-0">
      <span className="flex items-center gap-s1 group/name">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onCommit({ title: e.target.value })}
          placeholder="Service name"
          className="font-body font-medium text-l1 text-prim bg-transparent outline-none w-full placeholder:text-prim/25"
        />
        <button
          type="button"
          onClick={openPicker}
          className="shrink-0 grid place-items-center size-s3 rounded text-prim/30 hover:text-brand hover:bg-brand/8 transition-colors opacity-0 group-hover/name:opacity-100"
          aria-label="Pick from catalog"
        >
          <Icon name="caret-down" size="sm" />
        </button>
      </span>

      {open && (
        <>
          <span className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <span className="absolute z-40 top-[calc(100%+4px)] left-0 w-[260px] flex flex-col rounded-lg bg-white border border-prim/12 shadow-lg overflow-hidden max-h-[240px] overflow-y-auto">
            {!loaded && (
              <span className="px-s3 py-s2 font-body text-l1 text-prim/40">Loading…</span>
            )}
            {loaded && catalog.length === 0 && (
              <span className="px-s3 py-s2 font-body text-l3 text-prim/40">No catalog services</span>
            )}
            {catalog.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => pick(c)}
                className="flex flex-col items-start text-left px-s3 py-[10px] hover:bg-surface transition-colors cursor-pointer border-b border-prim/6 last:border-0"
              >
                <span className="font-body font-medium text-l1 text-prim">{c.title}</span>
                {c.price && <span className="font-body text-l2 text-prim/40">{c.price}{c.duration ? ` · ${c.duration}` : ""}</span>}
              </button>
            ))}
          </span>
        </>
      )}
    </span>
  );
}

function PricingBlock({ block, mode, onChange }: RenderProps) {
  const services = block.services;
  const setService = (i: number, patch: Partial<EditorService>) => {
    const next = services.map((s, j) => (j === i ? { ...s, ...patch } : s));
    onChange?.({ services: next });
  };
  const removeService = (i: number) => onChange?.({ services: services.filter((_, j) => j !== i) });
  const moveService = (i: number, dir: -1 | 1) => {
    const next = [...services];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange?.({ services: next });
  };
  const addService = () =>
    onChange?.({
      services: [
        ...services,
        { id: `tmp-${Date.now()}`, notionPageId: "", isRetainer: false, title: "", desc: "", price: "", duration: "" },
      ],
    });

  // Retainer rows multiply price × months; one-off rows use price as-is
  const effectiveTotal = (s: EditorService): number => {
    const n = parseFloat(s.price.replace(/[^0-9.]/g, ""));
    if (isNaN(n)) return 0;
    if (s.isRetainer) {
      const months = parseMonths(s.duration);
      return months !== null ? n * months : n;
    }
    return n;
  };

  const subtotal = services.reduce((sum, s) => sum + effectiveTotal(s), 0);
  const currency = services[0]?.price?.match(/[€$£]/)?.[0] ?? "€";
  const unit = services[0]?.price?.match(/[Kk]$/)?.[0]?.toUpperCase() ?? "";

  // VAT stored in block.body — a number string like "20" or "" for exempt/reverse-charge
  const vatRaw = block.body?.trim() ?? "";
  const vatRate = parseFloat(vatRaw);
  const hasVat = !isNaN(vatRate) && vatRate > 0;
  const vatAmount = hasVat ? subtotal * vatRate / 100 : 0;
  const grandTotal = subtotal + vatAmount;

  const fmt = (n: number) => currency + n.toLocaleString("en-US") + unit;

  return (
    <section className="flex flex-col gap-s4">
      {/* Heading row with column labels inline */}
      <div className={`flex items-center gap-s3 pb-s1 ${mode === "edit" ? "pr-s7" : ""}`}>
        <EditableText
          mode={mode}
          as="span"
          value={block.heading}
          onChange={(v) => onChange?.({ heading: v })}
          placeholder="Services"
          className="flex-1 font-body font-medium text-[10px] text-prim uppercase tracking-widest"
        />
        <span className="w-[88px] text-right font-body font-medium text-[10px] text-prim uppercase tracking-widest">Allocation</span>
        <span className="w-[80px] text-right font-body font-medium text-[10px] text-prim uppercase tracking-widest">Price</span>
      </div>

      {/* Service rows */}
      <div className="flex flex-col divide-y divide-prim/6">
        {services.map((s, i) => {
          const months = s.isRetainer ? parseMonths(s.duration) : null;
          const total = months !== null ? parseFloat(s.price.replace(/[^0-9.]/g, "")) * months : null;
          return (
            <div key={s.id} className={`relative flex items-center gap-s3 py-s2 ${mode === "edit" ? "pr-s7" : ""} group/row hover:bg-surface/60 rounded-sm transition-colors`}>
              {/* Name */}
              {mode === "edit" ? (
                <ServiceNameCell value={s.title} onCommit={(patch) => setService(i, patch)} />
              ) : (
                <span className="flex-1 flex items-center gap-s2 font-body font-medium text-l1 text-prim">
                  {s.title}
                  {s.isRetainer && (
                    <span className="inline-flex items-center h-s3 px-[6px] rounded bg-brand/8 text-brand text-[10px] font-body font-medium uppercase tracking-wide">Retainer</span>
                  )}
                </span>
              )}
              {/* Retainer toggle — edit only */}
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={() => setService(i, { isRetainer: !s.isRetainer })}
                  className={`shrink-0 inline-flex items-center h-s3 px-[6px] rounded text-[10px] font-body font-medium uppercase tracking-wide transition-colors cursor-pointer ${
                    s.isRetainer
                      ? "bg-brand/10 text-brand"
                      : "bg-prim/5 text-prim/20 opacity-0 group-hover/row:opacity-100"
                  }`}
                >
                  Retainer
                </button>
              )}
              {/* Duration */}
              {mode === "edit" ? (
                <input
                  value={s.duration}
                  onChange={(e) => setService(i, { duration: e.target.value })}
                  placeholder={s.isRetainer ? "0 months" : "1 FTE"}
                  className="w-[88px] text-right font-body font-medium text-l1 text-prim/40 bg-transparent outline-none placeholder:text-prim/20"
                />
              ) : (
                <span className="w-[88px] text-right font-body text-l1 text-prim/50">{s.duration || "—"}</span>
              )}
              {/* Price */}
              {mode === "edit" ? (
                <span className="w-[80px] flex items-center justify-end gap-[2px]">
                  <input
                    value={s.price}
                    onChange={(e) => setService(i, { price: e.target.value })}
                    onBlur={(e) => setService(i, { price: formatPrice(e.target.value) })}
                    placeholder="€0"
                    className={`text-right font-body font-medium text-l1 text-prim bg-transparent outline-none placeholder:text-prim/20 ${s.isRetainer ? "w-[60px]" : "w-full"}`}
                  />
                  {s.isRetainer && <span className="font-body font-medium text-l1 text-prim/40 shrink-0">/mo</span>}
                </span>
              ) : (
                <span className="w-[80px] flex items-center justify-end gap-[2px] font-body font-medium text-l1 text-prim">
                  {s.price || "—"}
                  {s.isRetainer && <span className="font-medium text-prim/40">/mo</span>}
                </span>
              )}
              {mode === "edit" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/row:opacity-100 transition-opacity bg-white/90 rounded">
                  <RemoveButton onClick={() => removeService(i)} label="Remove service" />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Add service — above subtotal */}
      {mode === "edit" && <AddButton onClick={addService}>Add service</AddButton>}

      {/* Subtotal + VAT + Grand total */}
      {services.length > 0 && subtotal > 0 && (
        <div className="flex flex-col gap-s1 border-t border-prim/10 pt-s2">
          {/* Subtotal — only show if VAT is set */}
          {hasVat && (
            <div className="flex items-center gap-s3">
              <span className="flex-1 font-body text-l2 text-prim/50">Subtotal excl. VAT</span>
              <span className="font-body text-l1 text-prim/70">{fmt(subtotal)}</span>
            </div>
          )}
          {/* VAT row */}
          <div className="flex items-center gap-s3">
            <span className="flex-1 flex items-center gap-s2 font-body text-l2 text-prim/50">
              VAT
              {mode === "edit" ? (
                <span className="inline-flex items-center gap-[2px]">
                  <input
                    value={vatRaw}
                    onChange={(e) => onChange?.({ body: e.target.value })}
                    placeholder="0"
                    className="w-[32px] font-body text-l2 text-prim/60 bg-prim/5 rounded px-1 text-center outline-none"
                  />
                  <span className="font-body text-l3 text-prim/40">%</span>
                </span>
              ) : (
                <span className="font-body text-l3 text-prim/40">
                  {hasVat ? `${vatRate}%` : "exempt / reverse charge"}
                </span>
              )}
            </span>
            <span className="font-body text-l1 text-prim/70">
              {hasVat ? fmt(vatAmount) : "—"}
            </span>
          </div>
          {/* Grand total */}
          <div className="flex items-center gap-s3 pt-s1 border-t border-prim/10 mt-s1">
            <span className="flex-1 font-body font-medium text-l2 text-prim/50">Total</span>
            <span className="font-display font-medium text-h4 text-prim">
              {fmt(hasVat ? grandTotal : subtotal)}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Registry ──────────────────────────────────────────────────────────────────

export type BlockEntry = {
  label: string;
  locked: boolean;
  Render: (props: RenderProps) => React.ReactElement;
};

export const BLOCK_REGISTRY: Record<BlockType, BlockEntry> = {
  header:      { label: "Header",                  locked: true,  Render: HeaderBlock },
  intro:       { label: "Executive Summary",        locked: true,  Render: ExecutiveSummaryBlock },
  approach:    { label: "Approach",                 locked: false, Render: ApproachBlock },
  impact:      { label: "Impact",                   locked: false, Render: TextBlock },
  pricing:     { label: "Pricing",                  locked: true,  Render: PricingBlock },
  cta:         { label: "CTA",                      locked: false, Render: CtaBlock },
  process:     { label: "Process",                  locked: false, Render: ProcessBlock },
  partnership: { label: "Partnership & Governance", locked: false, Render: PartnershipBlock },
  about:       { label: "About",                    locked: false, Render: AboutBlock },
  footer:      { label: "Footer",                   locked: true,  Render: FooterBlock },
  description: { label: "Description",              locked: false, Render: TextBlock },
  benefits:    { label: "Benefits",                 locked: false, Render: ListBlock },
  scope:       { label: "Scope",                    locked: false, Render: ListBlock },
};

/** Render a single block by type. */
export function BlockView(props: RenderProps) {
  const entry = BLOCK_REGISTRY[props.block.blockType];
  if (!entry) return null;
  return <entry.Render {...props} />;
}
