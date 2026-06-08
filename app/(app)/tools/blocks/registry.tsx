"use client";

/**
 * Block registry — the single source of truth for how each proposal block looks.
 * Exactly one `Render` per block type, used by BOTH the editor (mode="edit") and
 * the public proposal view (mode="view"). Same component → same pixels → WYSIWYG
 * by construction.
 */

import { Heading, Text, Icon, Logo } from "@/app/components/atoms";
import { EditableText } from "@/app/components/atoms/EditableText";
import type { BlockType, EditorBlock, EditorService, EditorStage } from "./types";

export type BlockMode = "edit" | "view";

export type RenderProps = {
  block: EditorBlock;
  mode: BlockMode;
  onChange?: (patch: Partial<EditorBlock>) => void;
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
      <span className="grid place-items-center size-s3 rounded-pill bg-brand/10 text-brand text-[16px] leading-none">+</span>
      {children}
    </button>
  );
}

// ─── Renderers ─────────────────────────────────────────────────────────────────

function HeaderBlock({ block, mode, onChange }: RenderProps) {
  return (
    <header className="flex flex-col gap-s5 pb-s8">
      <Logo size="md" />
      <div className="flex flex-col gap-s3">
        <EditableText
          mode={mode}
          as="span"
          value={block.clientName}
          onChange={(v) => onChange?.({ clientName: v })}
          placeholder="Client name"
          className="font-body font-medium text-l1 text-brand"
        />
        <EditableText
          mode={mode}
          as="h1"
          value={block.heading}
          onChange={(v) => onChange?.({ heading: v })}
          placeholder="Project title"
          className="font-display font-medium text-h1 text-prim leading-[1.02] tracking-[-0.03em]"
        />
        <EditableText
          mode={mode}
          as="p"
          value={block.subtitle}
          onChange={(v) => onChange?.({ subtitle: v })}
          placeholder="A short subtitle"
          className="font-body font-normal text-p1 text-prim/60"
        />
      </div>
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
        className="font-display font-medium text-h3 text-prim tracking-[-0.02em]"
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
        className="font-display font-medium text-h3 text-prim tracking-[-0.02em]"
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

function PricingBlock({ block, mode, onChange }: RenderProps) {
  const services = block.services;
  const setService = (i: number, patch: Partial<EditorService>) => {
    const next = services.map((s, j) => (j === i ? { ...s, ...patch } : s));
    onChange?.({ services: next });
  };
  const removeService = (i: number) => onChange?.({ services: services.filter((_, j) => j !== i) });
  const addService = () =>
    onChange?.({
      services: [
        ...services,
        { id: `tmp-${Date.now()}`, notionPageId: "", title: "Service", desc: "", price: "", duration: "" },
      ],
    });

  return (
    <section className="flex flex-col gap-s4">
      <EditableText
        mode={mode}
        as="h2"
        value={block.heading}
        onChange={(v) => onChange?.({ heading: v })}
        placeholder="Investment"
        className="font-display font-medium text-h3 text-prim tracking-[-0.02em]"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-s2">
        {services.map((s, i) => (
          <div key={s.id} className="grain relative bg-surface rounded-lg flex flex-col justify-between gap-s4 p-s4 min-h-[200px]">
            {mode === "edit" && (
              <div className="absolute top-s2 right-s2 z-10">
                <RemoveButton onClick={() => removeService(i)} label="Remove service" />
              </div>
            )}
            <div className="flex flex-col gap-s2">
              <EditableText
                mode={mode}
                as="h3"
                value={s.title}
                onChange={(v) => setService(i, { title: v })}
                placeholder="Service"
                className="font-display font-medium text-h4 text-prim"
              />
              <EditableText
                mode={mode}
                as="p"
                value={s.desc}
                onChange={(v) => setService(i, { desc: v })}
                placeholder="What's included"
                className="font-body font-normal text-p2 text-prim/70 leading-[1.5]"
              />
            </div>
            <div className="flex items-center justify-between pt-s2 border-t border-prim/10">
              <EditableText
                mode={mode}
                as="span"
                value={s.price}
                onChange={(v) => setService(i, { price: v })}
                placeholder="€0K"
                className="font-body font-medium text-h5 text-prim"
              />
              <EditableText
                mode={mode}
                as="span"
                value={s.duration}
                onChange={(v) => setService(i, { duration: v })}
                placeholder="—"
                className="font-body font-normal text-l1 text-prim/50"
              />
            </div>
          </div>
        ))}
      </div>
      {mode === "edit" && <AddButton onClick={addService}>Add service</AddButton>}
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
  header:      { label: "Header",      locked: true,  Render: HeaderBlock },
  intro:       { label: "Intro",       locked: true,  Render: TextBlock },
  pricing:     { label: "Pricing",     locked: true,  Render: PricingBlock },
  description: { label: "Description", locked: false, Render: TextBlock },
  benefits:    { label: "Benefits",    locked: false, Render: ListBlock },
  scope:       { label: "Scope",       locked: false, Render: ListBlock },
  process:     { label: "Process",     locked: false, Render: ProcessBlock },
};

/** Render a single block by type. */
export function BlockView(props: RenderProps) {
  const entry = BLOCK_REGISTRY[props.block.blockType];
  if (!entry) return null;
  return entry.Render(props);
}
