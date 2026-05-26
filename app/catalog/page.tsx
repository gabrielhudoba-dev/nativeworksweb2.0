"use client";

import { useState, type ReactNode } from "react";
import {
  Avatar,
  Badge,
  Divider,
  Heading,
  Icon,
  Link,
  Text,
  type IconName,
} from "@/app/components/atoms";
import { Button, IconButton, NavigationDots } from "@/app/components/molecules";

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
  "chevron-left",
  "chevron-right",
  "menu",
];

const colorTokens: { name: string; utility: string; hex: string }[] = [
  { name: "prim", utility: "bg-prim", hex: "#090E3A" },
  { name: "fg", utility: "bg-fg", hex: "#000000" },
  { name: "fg-inverse", utility: "bg-fg-inverse", hex: "#FFFFFF" },
  { name: "page", utility: "bg-page", hex: "#FFFFFF" },
  { name: "surface", utility: "bg-surface", hex: "#F5F5F7" },
  { name: "accent", utility: "bg-accent", hex: "#3255E6" },
  { name: "accent-fg", utility: "bg-accent-fg", hex: "#FFFFFF" },
  { name: "danger", utility: "bg-danger", hex: "#C80404" },
  { name: "danger-fg", utility: "bg-danger-fg", hex: "#F5F5F7" },
  { name: "pill", utility: "bg-pill", hex: "rgba(217,217,217,0.2)" },
  { name: "dot-inactive", utility: "bg-dot-inactive", hex: "rgba(9,14,58,0.1)" },
  { name: "divider", utility: "bg-divider", hex: "rgba(9,14,58,0.1)" },
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
    preview: <div className={`size-s6 rounded-md border border-divider ${c.utility}`} />,
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
    label: "Link",
    copy: '<Link href="/">Read more</Link>',
    preview: <Link href="/catalog">Read more</Link>,
  },
  {
    level: "atoms",
    label: "Divider",
    copy: "<Divider />",
    preview: (
      <div className="w-[480px] max-w-full">
        <Divider />
      </div>
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
    label: "Button · secondary",
    copy: '<Button variant="secondary">Button label</Button>',
    preview: (
      <Button variant="secondary" className="w-[180px]">
        Button label
      </Button>
    ),
  },
  {
    level: "molecules",
    label: "Button · pill",
    copy: '<Button variant="pill" rightIcon="arrow-right">Button label</Button>',
    preview: (
      <Button variant="pill" rightIcon="arrow-right" className="w-[240px]">
        Button label
      </Button>
    ),
  },
  {
    level: "molecules",
    label: "NavigationDots",
    copy: "<NavigationDots count={5} />",
    preview: <NavigationDots count={5} />,
  },
  {
    level: "molecules",
    label: "IconButton",
    copy: '<IconButton icon="chevron-right" label="Akcia" />',
    preview: <IconButton icon="chevron-right" label="Akcia" />,
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
  organisms: "Zatiaľ tu nič nie je. Organisms pribudnú v ďalšej iterácii.",
};

function HoverCopy({ label, copy }: { label: string; copy: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(copy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <button
      type="button"
      onClick={handle}
      title={copied ? "Copied!" : `Copy "${copy}"`}
      className="absolute -top-2 left-0 -translate-y-full inline-flex items-center gap-s4 px-s5 py-s4 rounded-pill bg-prim text-fg-inverse opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-10 shadow-elevated whitespace-nowrap cursor-pointer"
    >
      <span className="font-body text-l3">{label}</span>
      <Icon name={copied ? "check" : "copy"} size="sm" />
    </button>
  );
}

function EntryItem({ entry }: { entry: Entry }) {
  return (
    <article className="relative group inline-flex">
      <HoverCopy label={entry.label} copy={entry.copy} />
      <div>{entry.preview}</div>
    </article>
  );
}

export default function CatalogPage() {
  const [active, setActive] = useState<Level>("colors");
  const items = entries.filter((e) => e.level === active);
  const layout = levelLayout[active];

  return (
    <main className="mx-auto w-full max-w-s14 px-s9 py-s8 flex flex-col gap-s8">
      <header className="flex flex-col gap-s5">
        <Heading variant="h2" as="h1">
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
                isActive ? "bg-prim text-fg-inverse" : "bg-surface text-fg hover:bg-pill"
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
