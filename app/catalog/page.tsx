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
import { Button, NavigationDots } from "@/app/components/molecules";

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
  { name: "4", valuePx: 4 },
  { name: "8", valuePx: 8 },
  { name: "12", valuePx: 12 },
  { name: "16", valuePx: 16 },
  { name: "20", valuePx: 20 },
  { name: "24", valuePx: 24 },
  { name: "32", valuePx: 32 },
  { name: "48", valuePx: 48 },
  { name: "64", valuePx: 64 },
  { name: "80", valuePx: 80 },
  { name: "1280", valuePx: 1280 },
  { name: "1440", valuePx: 1440 },
];

const VISUAL_CAP = 240;

function SpacingBar({ valuePx }: { valuePx: number }) {
  const capped = Math.min(valuePx, VISUAL_CAP);
  return (
    <div className="flex items-center">
      <div className="bg-prim h-8 rounded-sm" style={{ width: `${capped}px` }} />
      <Text variant="meta-sm" as="span" className="opacity-60">
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
    preview: <div className={`size-24 rounded-md border border-divider ${c.utility}`} />,
  })),

  // ─── Text (Heading + Text) ───
  {
    level: "text",
    label: "Heading · display",
    copy: '<Heading variant="display">Display heading</Heading>',
    preview: <Heading variant="display">Display heading</Heading>,
  },
  {
    level: "text",
    label: "Heading · h1",
    copy: '<Heading variant="h1">Section title</Heading>',
    preview: <Heading variant="h1">Section title</Heading>,
  },
  {
    level: "text",
    label: "Heading · h2",
    copy: '<Heading variant="h2">Subheading</Heading>',
    preview: <Heading variant="h2">Subheading</Heading>,
  },
  {
    level: "text",
    label: "Heading · card",
    copy: '<Heading variant="card">Card title</Heading>',
    preview: <Heading variant="card">Card title</Heading>,
  },
  {
    level: "text",
    label: "Heading · stat",
    copy: '<Heading variant="stat">Stat number</Heading>',
    preview: <Heading variant="stat">Stat number</Heading>,
  },
  {
    level: "text",
    label: "Text · body",
    copy: '<Text variant="body">Body text</Text>',
    preview: (
      <Text variant="body">
        Body text paragraph that wraps over multiple lines naturally inside its container.
      </Text>
    ),
  },
  {
    level: "text",
    label: "Text · eyebrow",
    copy: '<Text variant="eyebrow">Eyebrow</Text>',
    preview: <Text variant="eyebrow">Eyebrow</Text>,
  },
  {
    level: "text",
    label: "Text · bullet-label",
    copy: '<Text variant="bullet-label">Bullet label</Text>',
    preview: <Text variant="bullet-label">Bullet label</Text>,
  },
  {
    level: "text",
    label: "Text · bullet-desc",
    copy: '<Text variant="bullet-desc">Bullet description</Text>',
    preview: <Text variant="bullet-desc">Bullet description</Text>,
  },
  {
    level: "text",
    label: "Text · meta",
    copy: '<Text variant="meta">Meta name</Text>',
    preview: <Text variant="meta">Meta name</Text>,
  },
  {
    level: "text",
    label: "Text · meta-sm",
    copy: '<Text variant="meta-sm">Meta sub</Text>',
    preview: <Text variant="meta-sm">Meta sub</Text>,
  },
  {
    level: "text",
    label: "Text · price",
    copy: '<Text variant="price">Price</Text>',
    preview: <Text variant="price">Price</Text>,
  },
  {
    level: "text",
    label: "Text · price-regular",
    copy: '<Text variant="price-regular">Duration</Text>',
    preview: <Text variant="price-regular">Duration</Text>,
  },
  {
    level: "text",
    label: "Text · cta",
    copy: '<Text variant="cta">CTA label</Text>',
    preview: <Text variant="cta">CTA label</Text>,
  },
  {
    level: "text",
    label: "Text · badge",
    copy: '<Text variant="badge" as="span">Badge</Text>',
    preview: (
      <Text variant="badge" as="span">
        Badge
      </Text>
    ),
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
      className="absolute -top-2 left-0 -translate-y-full inline-flex items-center gap-8 px-12 py-8 rounded-pill bg-prim text-fg-inverse opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-10 shadow-elevated whitespace-nowrap cursor-pointer"
    >
      <span className="font-body text-meta-sm">{label}</span>
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
    <main className="mx-auto w-full max-w-1280 px-80 py-64 flex flex-col gap-64">
      <header className="flex flex-col gap-16">
        <Heading variant="display" as="h1">
          Component catalog
        </Heading>
        <Text variant="eyebrow">
          Every element is a component. Every value is a token. Nothing is custom.
        </Text>
      </header>

      {/* Horizontal tabs */}
      <nav aria-label="Catalog sections" className="flex flex-wrap gap-8">
        {tabs.map((t) => {
          const isActive = active === t.id;
          const count = entries.filter((e) => e.level === t.id).length;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              aria-current={isActive ? "page" : undefined}
              className={`px-24 py-12 rounded-pill font-body text-cta transition-colors duration-300 ease-out cursor-pointer ${
                isActive ? "bg-prim text-fg-inverse" : "bg-surface text-fg hover:bg-pill"
              }`}
            >
              {t.label}
              <span className="ml-2 text-meta-sm opacity-60">{count}</span>
            </button>
          );
        })}
      </nav>

      {/* Section title for active tab */}
      <section className="flex flex-col gap-32">
        <Heading variant="h2">{tabs.find((t) => t.id === active)?.label}</Heading>

        {items.length === 0 ? (
          <Text variant="body" className="opacity-60">
            {emptyMessage[active]}
          </Text>
        ) : layout === "row" ? (
          <ul className="flex flex-wrap gap-32">
            {items.map((e, i) => (
              <li key={`${e.level}-${e.label}-${i}`}>
                <EntryItem entry={e} />
              </li>
            ))}
          </ul>
        ) : layout === "grid" ? (
          <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-32">
            {items.map((e, i) => (
              <li key={`${e.level}-${e.label}-${i}`}>
                <EntryItem entry={e} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col gap-32">
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
