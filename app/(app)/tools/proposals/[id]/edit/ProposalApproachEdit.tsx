"use client";

import { useRef, useState } from "react";
import { Icon } from "@/app/components/atoms";
import { EditableText } from "@/app/components/atoms/EditableText";
import { getCatalogServicesAction } from "@/app/(app)/tools/proposals/actions";
import type { EditorBlock, EditorService, EditorStage } from "@/app/(app)/tools/blocks/types";

function parseMonths(duration: string): number | null {
  const m = duration?.match(/(\d+(?:\.\d+)?)\s*mo/i);
  if (m) return parseFloat(m[1]);
  const w = duration?.match(/(\d+(?:\.\d+)?)\s*w/i);
  if (w) return parseFloat(w[1]) / 4.33;
  return null;
}

type CatalogService = { id: number; title: string; desc: string; price: string; duration: string };

function CatalogPicker({ onPick }: { onPick: (patch: Partial<EditorService>) => void }) {
  const [open, setOpen] = useState(false);
  const [catalog, setCatalog] = useState<CatalogService[]>([]);
  const [loaded, setLoaded] = useState(false);

  function openPicker() {
    setOpen(true);
    if (!loaded) {
      getCatalogServicesAction().then((rows) => { setCatalog(rows); setLoaded(true); });
    }
  }

  function pick(c: CatalogService) {
    onPick({ title: c.title, desc: c.desc, price: c.price, duration: c.duration });
    setOpen(false);
  }

  return (
    <span className="relative shrink-0">
      <button
        type="button"
        onClick={openPicker}
        className="grid place-items-center size-s3 rounded text-prim/30 hover:text-brand hover:bg-brand/8 transition-colors opacity-0 group-hover/name:opacity-100"
        aria-label="Pick from catalog"
      >
        <Icon name="caret-down" size="sm" />
      </button>

      {open && (
        <>
          <span className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <span className="absolute z-40 top-[calc(100%+4px)] left-0 w-[260px] flex flex-col rounded-lg bg-white border border-prim/12 shadow-lg overflow-hidden max-h-[240px] overflow-y-auto">
            {!loaded && <span className="px-s3 py-s2 font-body text-l1 text-prim/40">Loading…</span>}
            {loaded && catalog.length === 0 && <span className="px-s3 py-s2 font-body text-l3 text-prim/40">No catalog services</span>}
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

type Props = {
  approachBlock: EditorBlock;
  pricingBlock: EditorBlock;
  onChangeApproach: (patch: Partial<EditorBlock>) => void;
  onChangePricing: (patch: Partial<EditorBlock>) => void;
};

export function ProposalApproachEdit({ approachBlock, pricingBlock, onChangeApproach, onChangePricing }: Props) {
  const stages = approachBlock.stages;
  const services = pricingBlock.services;

  const setStage = (i: number, patch: Partial<EditorStage>) =>
    onChangeApproach({ stages: stages.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
  const removeStage = (i: number) => {
    onChangeApproach({ stages: stages.filter((_, j) => j !== i) });
    onChangePricing({ services: services.filter((_, j) => j !== i) });
  };
  const addStage = () => {
    onChangeApproach({ stages: [...stages, { title: "", duration: "", desc: "" }] });
    onChangePricing({
      services: [
        ...services,
        { id: `tmp-${Date.now()}`, notionPageId: "", isRetainer: false, title: "", desc: "", price: "", duration: "", allocation: "" },
      ],
    });
  };

  const setService = (i: number, patch: Partial<EditorService>) => {
    const updated = [...services];
    if (updated[i]) {
      updated[i] = { ...updated[i], ...patch };
    } else {
      updated[i] = { id: `tmp-${i}`, notionPageId: "", isRetainer: false, title: "", desc: "", price: "", duration: "", allocation: "", ...patch };
    }
    onChangePricing({ services: updated });
  };
  const removeService = (i: number) =>
    onChangePricing({ services: services.filter((_, j) => j !== i) });

  const currency = services[0]?.price?.match(/[€$£]/)?.[0] ?? "€";

  const total = services.reduce((sum, s) => {
    const n = parseFloat(s.price.replace(/[^0-9.]/g, ""));
    if (isNaN(n)) return sum;
    return sum + (s.isRetainer ? (parseMonths(s.duration) ?? 1) * n : n);
  }, 0);

  return (
    <section className="flex flex-col gap-s2">
      <EditableText
        mode="edit"
        as="span"
        value={approachBlock.heading}
        onChange={(v) => onChangeApproach({ heading: v })}
        placeholder="Approach"
        className="font-body font-medium text-[10px] text-prim uppercase tracking-widest"
      />

      <div className="flex flex-col gap-s6">
        {stages.map((stage, i) => {
          const svc = services[i] ?? { id: `tmp-${i}`, notionPageId: "", isRetainer: false, title: "", desc: "", price: "", duration: "", allocation: "" };
          const months = svc.isRetainer ? parseMonths(svc.duration) : null;
          const priceNum = parseFloat(svc.price.replace(/[^0-9.]/g, ""));

          return (
            <div key={i} className="relative flex flex-col gap-s1">
              <div className="absolute top-0 right-0">
                <button
                  type="button"
                  onClick={() => removeStage(i)}
                  aria-label="Remove phase"
                  className="grid place-items-center size-s4 rounded-pill bg-prim/5 text-prim/50 hover:bg-prim/10 hover:text-prim transition-colors cursor-pointer"
                >
                  <Icon name="close" size="sm" />
                </button>
              </div>

              <div className="flex items-center gap-s2 flex-wrap pr-s5">
                <EditableText
                  mode="edit"
                  as="h3"
                  value={stage.title}
                  onChange={(v) => setStage(i, { title: v })}
                  placeholder="Phase title"
                  className="font-display font-medium text-[24px] leading-tight text-prim tracking-[-0.02em]"
                />
              </div>

              <EditableText
                mode="edit"
                as="p"
                value={stage.desc}
                onChange={(v) => setStage(i, { desc: v })}
                placeholder="Describe this phase…"
                className="font-body font-normal text-p1 text-prim/70 leading-[1.5] whitespace-pre-wrap"
              />

              <div className="mt-s2 py-s2 border-y border-prim/15 flex flex-col sm:flex-row sm:items-end gap-[3px] sm:gap-s3 group/svc">
                {/* Service name column */}
                <span className="flex-1 min-w-0 flex flex-col gap-[3px]">
                  <span className="font-body text-[9px] text-prim/30 uppercase tracking-widest">Service</span>
                  <span className="flex items-center gap-[6px] group/name">
                    <input
                      value={svc.title}
                      onChange={(e) => setService(i, { title: e.target.value })}
                      placeholder="Service name"
                      className="font-body font-medium text-l2 text-prim/60 bg-transparent outline-none placeholder:text-prim/20 min-w-0 w-full"
                    />
                    <CatalogPicker onPick={(patch) => setService(i, patch)} />
                    <button
                      type="button"
                      onClick={() => setService(i, { isRetainer: !svc.isRetainer })}
                      className={`shrink-0 inline-flex items-center h-s3 px-[6px] rounded text-[10px] font-body font-medium uppercase tracking-wide transition-colors cursor-pointer ${
                        svc.isRetainer
                          ? "bg-brand/10 text-brand"
                          : "bg-prim/5 text-prim/20 opacity-0 group-hover/svc:opacity-100"
                      }`}
                    >
                      Retainer
                    </button>
                  </span>
                </span>

                {/* Duration, Allocation, Price columns */}
                <span className="flex items-end gap-s3 sm:shrink-0">
                  <span className="flex flex-col gap-[3px]">
                    <span className="font-body text-[9px] text-prim/30 uppercase tracking-widest">Duration</span>
                    <input
                      value={svc.duration}
                      onChange={(e) => setService(i, { duration: e.target.value })}
                      placeholder="—"
                      className="w-[72px] font-body text-l2 text-prim/60 bg-transparent outline-none placeholder:text-prim/20"
                    />
                  </span>
                  <span className="flex flex-col gap-[3px]">
                    <span className="font-body text-[9px] text-prim/30 uppercase tracking-widest">Allocation</span>
                    <input
                      value={svc.allocation}
                      onChange={(e) => setService(i, { allocation: e.target.value })}
                      placeholder="—"
                      className="w-[60px] font-body text-l2 text-prim/60 bg-transparent outline-none placeholder:text-prim/20"
                    />
                  </span>
                  <span className="flex flex-col gap-[3px]">
                    <span className="font-body text-[9px] text-prim/30 uppercase tracking-widest text-right">Price</span>
                    <span className="flex items-center gap-[4px]">
                      <input
                        value={svc.price}
                        onChange={(e) => setService(i, { price: e.target.value })}
                        placeholder="€0"
                        className={`font-body font-medium text-l2 text-prim bg-transparent outline-none text-right placeholder:text-prim/20 ${svc.isRetainer ? "w-[56px]" : "w-[80px]"}`}
                      />
                      {svc.isRetainer && (
                        <>
                          <span className="font-normal text-l2 text-prim/60">/mo</span>
                          {months !== null && !isNaN(priceNum) && (
                            <span className="font-normal text-l2 text-prim/60">
                              {currency}{(priceNum * months).toLocaleString("en-US")}
                            </span>
                          )}
                        </>
                      )}
                    </span>
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addStage}
        className="inline-flex items-center gap-s1 text-l2 text-brand hover:opacity-70 transition-opacity cursor-pointer"
      >
        <span className="grid place-items-center size-s3 rounded-pill bg-brand/10 text-brand">
          <Icon name="plus" size="sm" />
        </span>
        Add phase
      </button>

      {/* Extra services beyond paired stages (legacy data) */}
      {services.slice(stages.length).map((svc, idx) => {
        const i = stages.length + idx;
        const months = svc.isRetainer ? parseMonths(svc.duration) : null;
        const priceNum = parseFloat(svc.price.replace(/[^0-9.]/g, ""));
        return (
          <div key={svc.id} className="py-s2 border-y border-prim/15 flex flex-col sm:flex-row sm:items-end gap-[3px] sm:gap-s3 group/svc">
            <span className="flex-1 min-w-0 flex flex-col gap-[3px]">
              <span className="font-body text-[9px] text-prim/30 uppercase tracking-widest">Service</span>
              <span className="flex items-center gap-[6px] group/name">
                <input value={svc.title} onChange={(e) => setService(i, { title: e.target.value })} placeholder="Service name" className="font-body font-medium text-l2 text-prim/60 bg-transparent outline-none placeholder:text-prim/20 min-w-0 w-full" />
                <CatalogPicker onPick={(patch) => setService(i, patch)} />
                <button type="button" onClick={() => setService(i, { isRetainer: !svc.isRetainer })} className={`shrink-0 inline-flex items-center h-s3 px-[6px] rounded text-[10px] font-body font-medium uppercase tracking-wide transition-colors cursor-pointer ${svc.isRetainer ? "bg-brand/10 text-brand" : "bg-prim/5 text-prim/20 opacity-0 group-hover/svc:opacity-100"}`}>Retainer</button>
              </span>
            </span>
            <span className="flex items-end gap-s3 sm:shrink-0">
              <span className="flex flex-col gap-[3px]">
                <span className="font-body text-[9px] text-prim/30 uppercase tracking-widest">Duration</span>
                <input value={svc.duration} onChange={(e) => setService(i, { duration: e.target.value })} placeholder="—" className="w-[72px] font-body text-l2 text-prim/60 bg-transparent outline-none placeholder:text-prim/20" />
              </span>
              <span className="flex flex-col gap-[3px]">
                <span className="font-body text-[9px] text-prim/30 uppercase tracking-widest">Allocation</span>
                <input value={svc.allocation} onChange={(e) => setService(i, { allocation: e.target.value })} placeholder="—" className="w-[60px] font-body text-l2 text-prim/60 bg-transparent outline-none placeholder:text-prim/20" />
              </span>
              <span className="flex flex-col gap-[3px]">
                <span className="font-body text-[9px] text-prim/30 uppercase tracking-widest">Price</span>
                <span className="flex items-center gap-[4px]">
                  <input value={svc.price} onChange={(e) => setService(i, { price: e.target.value })} placeholder="€0" className="w-[72px] font-body font-medium text-l2 text-prim bg-transparent outline-none text-right placeholder:text-prim/20" />
                  {svc.isRetainer && (
                    <>
                      <span className="text-l2 text-prim/60">/mo</span>
                      {months !== null && !isNaN(priceNum) && <span className="text-l2 text-prim/60">{currency}{(priceNum * months).toLocaleString("en-US")}</span>}
                    </>
                  )}
                </span>
              </span>
            </span>
            <button type="button" onClick={() => removeService(i)} aria-label="Remove service" className="shrink-0 opacity-0 group-hover/svc:opacity-100 grid place-items-center size-s4 rounded-pill bg-prim/5 text-prim/50 hover:bg-prim/10 hover:text-prim transition-all cursor-pointer">
              <Icon name="close" size="sm" />
            </button>
          </div>
        );
      })}

      {services.length > 0 && (
        <div className="flex flex-col gap-[2px] pt-s2">
          {/* <div className="flex justify-between">
            <span className="font-body text-l2 text-prim/60">Subtotal excl. VAT</span>
            <span className="font-body text-l2 text-prim/60">{currency}{subtotal.toLocaleString("en-US")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-[6px] font-body text-l2 text-prim/60">
              VAT ·
              <span className="inline-flex items-center gap-[2px]">
                <input
                  value={vatRaw}
                  onChange={(e) => onChangePricing({ body: e.target.value })}
                  placeholder="0"
                  className="w-[32px] font-body text-l2 text-prim/60 bg-prim/5 rounded px-1 text-center outline-none"
                />
                <span className="font-body text-l3 text-prim/40">%</span>
              </span>
            </span>
            <span className="font-body text-l2 text-prim/60">
              {hasVat ? `${currency}${vatAmount.toLocaleString("en-US")}` : "—"}
            </span>
          </div> */}
          <div className="flex justify-between pt-s2 mt-s1 border-t-2 border-prim">
            <span className="font-body font-medium text-l1 text-prim">Total</span>
            <span className="font-body font-medium text-l1 text-prim">
              {currency}{total.toLocaleString("en-US")}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
