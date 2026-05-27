"use client";

import { useState, type ReactNode } from "react";
import {
  Avatar,
  Badge,
  Heading,
  Icon,
  IconButton,
  Text,
  type IconName,
} from "@/app/components/atoms";
import { Button, GalleryNav, NavPrimPill, Refer } from "@/app/components/molecules";
import { Footer } from "@/app/components/organisms";

function NavPrimPillPreview() {
  const [open, setOpen] = useState(false);
  return <NavPrimPill static open={open} onToggle={() => setOpen(o => !o)} />;
}

function GalleryNavPreview() {
  const COUNT = 4;
  const [active, setActive] = useState(0);
  return (
    <GalleryNav
      count={COUNT}
      active={active}
      onPrev={() => setActive(i => (i - 1 + COUNT) % COUNT)}
      onNext={() => setActive(i => (i + 1) % COUNT)}
      onDotClick={setActive}
    />
  );
}

type Level =
  | "colors"
  | "text"
  | "spacing"
  | "icons"
  | "atoms"
  | "molecules"
  | "organisms";

type Entry = {
  level: Level;
  label: string;     // shown in tooltip
  copy: string;      // copied to clipboard on click
  preview: ReactNode;
  layout?: "row" | "grid" | "stack"; // override section layout
};

const iconNames: IconName[] = [
  "arrow-right",
  "microscope",
  "person-simple-run",
  "brackets-curly",
  "caret-left",
  "caret-right",
  "menu",
];

const colorTokens: { name: string; utility: string; hex: string }[] = [
  { name: "prim", utility: "bg-prim", hex: "#090E3A" },
  { name: "surface", utility: "bg-surface", hex: "#F5F5F7" },
  { name: "brand", utility: "bg-brand", hex: "#3255E6" },
  { name: "white", utility: "bg-white", hex: "#FFFFFF" },
];

// Spacing + sizing = same Tailwind v4 namespace (--spacing-*). One tab, sorted by value.
const spacingTokens: { name: string; valuePx: number }[] = [
  { name: "s1", valuePx: 2 },
  { name: "s2", valuePx: 3 },
  { name: "s3", valuePx: 5 },
  { name: "s4", valuePx: 8 },
  { name: "s5", valuePx: 13 },
  { name: "s6", valuePx: 21 },
  { name: "s7", valuePx: 34 },
  { name: "s8", valuePx: 55 },
  { name: "s9", valuePx: 89 },
  { name: "s10", valuePx: 144 },
  { name: "s11", valuePx: 233 },
  { name: "s12", valuePx: 377 },
  { name: "s13", valuePx: 610 },
  { name: "s14", valuePx: 1280 },
  { name: "s15", valuePx: 1440 },
];

const VISUAL_CAP = 240;

function SpacingBar({ valuePx }: { valuePx: number }) {
  const capped = Math.min(valuePx, VISUAL_CAP);
  return (
    <div className="flex items-center">
      <div className="bg-prim h-s4 rounded-sm" style={{ width: `${capped}px` }} />
      <Text variant="l3" as="span" className="opacity-60">
        {valuePx}px
      </Text>
    </div>
  );
}

const entries: Entry[] = [
  // ─── Colors ───
  ...colorTokens.map<Entry>((c) => ({
    level: "colors",
    label: `${c.name} · ${c.hex}`,
    copy: c.utility,
    preview: <div className={`size-s9 rounded-xl border border-divider ${c.utility}`} />,
  })),

  // ─── Text (Heading + Text) — 1:1 Figma tokens ───
  {
    level: "text",
    label: "Heading · h2 · 70px",
    copy: '<Heading variant="h2">Nadpis</Heading>',
    preview: <Heading variant="h2">Nadpis</Heading>,
  },
  {
    level: "text",
    label: "Heading · h3 · 32px",
    copy: '<Heading variant="h3">Podnadpis</Heading>',
    preview: <Heading variant="h3">Podnadpis</Heading>,
  },
  {
    level: "text",
    label: "Heading · numb1 · 60px",
    copy: '<Heading variant="numb1">2 weeks</Heading>',
    preview: <Heading variant="numb1">2 weeks</Heading>,
  },
  {
    level: "text",
    label: "Text · h5 · 24px",
    copy: '<Text variant="h5">Heading five</Text>',
    preview: <Text variant="h5">Heading five</Text>,
  },
  {
    level: "text",
    label: "Text · p1 · 24px",
    copy: '<Text variant="p1">Paragraph one</Text>',
    preview: <Text variant="p1">Paragraph one</Text>,
  },
  {
    level: "text",
    label: "Text · p2 · 20px",
    copy: '<Text variant="p2">Paragraph two</Text>',
    preview: <Text variant="p2">Paragraph two</Text>,
  },
  {
    level: "text",
    label: "Text · p3 · 18px",
    copy: '<Text variant="p3">Paragraph three</Text>',
    preview: <Text variant="p3">Paragraph three</Text>,
  },
  {
    level: "text",
    label: "Text · l1 · 18px medium",
    copy: '<Text variant="l1">Label one</Text>',
    preview: <Text variant="l1">Label one</Text>,
  },
  {
    level: "text",
    label: "Text · l2 · 16px medium",
    copy: '<Text variant="l2">Label two</Text>',
    preview: <Text variant="l2">Label two</Text>,
  },
  {
    level: "text",
    label: "Text · l3 · 15px",
    copy: '<Text variant="l3">Label three</Text>',
    preview: <Text variant="l3">Label three</Text>,
  },

  // ─── Spacing (includes sizing — same Tailwind v4 namespace) ───
  ...spacingTokens.map<Entry>((s) => ({
    level: "spacing",
    label: `${s.name} · ${s.valuePx}px`,
    copy: `px-${s.name}`,
    preview: <SpacingBar valuePx={s.valuePx} />,
  })),

  // ─── Icons ───
  ...iconNames.map<Entry>((n) => ({
    level: "icons",
    label: `Icon · ${n}`,
    copy: `<Icon name="${n}" />`,
    preview: (
      <span className="text-prim inline-flex">
        <Icon name={n} size="md" title={n} />
      </span>
    ),
  })),

  // ─── Atoms (the rest) ───
  {
    level: "atoms",
    label: "IconButton",
    copy: '<IconButton icon="chevron-right" label="Akcia" />',
    preview: <IconButton icon="chevron-right" label="Akcia" />,
  },
  {
    level: "atoms",
    label: "Avatar · 32×32",
    copy: '<Avatar src="..." alt="..." size={32} />',
    preview: (
      <Avatar
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&fit=crop"
        alt="Sample"
        size={32}
      />
    ),
  },
  {
    level: "atoms",
    label: "Badge · ai",
    copy: '<Badge variant="ai">AI</Badge>',
    preview: <Badge variant="ai">AI</Badge>,
  },

  // ─── Molecules ───
  {
    level: "molecules",
    label: "Button · primary",
    copy: '<Button variant="primary" rightIcon="arrow-right">Button label</Button>',
    preview: (
      <Button variant="primary" rightIcon="arrow-right" className="w-[260px]">
        Button label
      </Button>
    ),
  },
  {
    level: "molecules",
    label: "NavPrimPill",
    copy: "<NavPrimPill open={open} onToggle={() => setOpen(o => !o)} />",
    preview: <NavPrimPillPreview />,
  },
  {
    level: "molecules",
    label: "GalleryNav",
    copy: "<GalleryNav count={4} active={active} onPrev={...} onNext={...} onDotClick={...} />",
    preview: <GalleryNavPreview />,
  },
  {
    level: "molecules",
    label: "Refer",
    copy: '<Refer name="Martin Mroc" role="CDO, Vibe Studio" avatar="/images/martin.png" />',
    preview: <Refer name="Martin Mroc" role="CDO, Vibe Studio" avatar="/images/martin.png" />,
  },

  // ─── Organisms ───
  {
    level: "organisms",
    label: "Footer",
    copy: "<Footer />",
    preview: <div className="w-full scale-[0.5] origin-top-left pointer-events-none"><Footer /></div>,
  },
];

const tabs: { id: Level; label: string }[] = [
  { id: "colors", label: "Colors" },
  { id: "text", label: "Text" },
  { id: "spacing", label: "Spacing" },
  { id: "icons", label: "Icons" },
  { id: "atoms", label: "Atoms" },
  { id: "molecules", label: "Molecules" },
  { id: "organisms", label: "Organisms" },
];

const levelLayout: Record<Level, "row" | "grid" | "stack"> = {
  colors: "row",
  text: "stack",
  spacing: "stack",
  icons: "grid",
  atoms: "stack",
  molecules: "stack",
  organisms: "stack",
};

const emptyMessage: Record<Level, string> = {
  colors: "",
  text: "",
  spacing: "",
  icons: "",
  atoms: "",
  molecules: "",
  organisms: "",
};

function EntryItem({ entry }: { entry: Entry }) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(entry.copy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <article
      className="relative inline-flex flex-col pt-s7"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={handle}
        title={copied ? "Copied!" : `Copy "${entry.copy}"`}
        className={`absolute top-0 left-0 inline-flex items-center gap-s4 px-s5 py-s4 rounded-pill bg-prim text-white transition-opacity duration-200 z-10 shadow-elevated whitespace-nowrap cursor-pointer ${hovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <span className="font-body text-l3">{entry.label}</span>
        <Icon name={copied ? "check" : "copy"} size="sm" />
      </button>
      <div>{entry.preview}</div>
    </article>
  );
}

export default function CatalogPage() {
  const [active, setActive] = useState<Level>("colors");
  const items = entries.filter((e) => e.level === active);
  const layout = levelLayout[active];

  return (
    <main className="mx-auto w-full max-w-s14 px-s9 pt-s10 pb-s8 flex flex-col gap-s8">
      <header className="flex flex-col gap-s5">
        <Heading variant="h3" as="h1">
          Component catalog
        </Heading>
        <Text variant="p3">
          Every element is a component. Every value is a token. Nothing is custom.
        </Text>
      </header>

      {/* Horizontal tabs */}
      <nav aria-label="Catalog sections" className="flex flex-wrap gap-s4">
        {tabs.map((t) => {
          const isActive = active === t.id;
          const count = entries.filter((e) => e.level === t.id).length;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              aria-current={isActive ? "page" : undefined}
              className={`px-s6 py-s5 rounded-pill font-body text-p2 transition-colors duration-300 ease-out cursor-pointer ${
                isActive ? "bg-prim text-white" : "bg-surface text-prim hover:bg-white/20"
              }`}
            >
              {t.label}
              <span className="ml-2 text-l3 opacity-60">{count}</span>
            </button>
          );
        })}
      </nav>

      {/* Section title for active tab */}
      <section className="flex flex-col gap-s7">
        <Heading variant="h3">{tabs.find((t) => t.id === active)?.label}</Heading>

        {items.length === 0 ? (
          <Text variant="p3" className="opacity-60">
            {emptyMessage[active]}
          </Text>
        ) : layout === "row" ? (
          <ul className="flex flex-wrap gap-s7">
            {items.map((e, i) => (
              <li key={`${e.level}-${e.label}-${i}`}>
                <EntryItem entry={e} />
              </li>
            ))}
          </ul>
        ) : layout === "grid" ? (
          <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-s7">
            {items.map((e, i) => (
              <li key={`${e.level}-${e.label}-${i}`}>
                <EntryItem entry={e} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col gap-s7">
            {items.map((e, i) => (
              <li key={`${e.level}-${e.label}-${i}`}>
                <EntryItem entry={e} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
