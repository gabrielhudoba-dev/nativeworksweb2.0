"use client";

import { useState, type ReactNode } from "react";
import {
  Avatar,
  Badge,
  Heading,
  Icon,
  IconButton,
  Logo,
  Text,
  type IconName,
} from "@/app/components/atoms";
import { Button, GalleryNav, NavPrimPill, Refer, ServiceCard, SocialLink, SOCIAL_ICONS, StageCard, StatColumn } from "@/app/components/molecules";

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

type Level = "colors" | "text" | "spacing" | "icons" | "atoms" | "molecules";

type Variant = { label: string; preview: ReactNode };

type Entry = {
  level: Level;
  label: string;
  copy: string;
  variants: [Variant, ...Variant[]];
  layout?: "row" | "grid" | "stack";
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

const spacingTokens: { name: string; valuePx: number; widthClass: string }[] = [
  { name: "s1",  valuePx: 2,    widthClass: "w-s1" },
  { name: "s2",  valuePx: 3,    widthClass: "w-s2" },
  { name: "s3",  valuePx: 5,    widthClass: "w-s3" },
  { name: "s4",  valuePx: 8,    widthClass: "w-s4" },
  { name: "s5",  valuePx: 13,   widthClass: "w-s5" },
  { name: "s6",  valuePx: 21,   widthClass: "w-s6" },
  { name: "s7",  valuePx: 34,   widthClass: "w-s7" },
  { name: "s8",  valuePx: 55,   widthClass: "w-s8" },
  { name: "s9",  valuePx: 89,   widthClass: "w-s9" },
  { name: "s10", valuePx: 144,  widthClass: "w-s10" },
  { name: "s11", valuePx: 233,  widthClass: "w-s11" },
  { name: "s12", valuePx: 377,  widthClass: "w-s12" },
  { name: "s13", valuePx: 610,  widthClass: "w-s13" },
  { name: "s14", valuePx: 1280, widthClass: "w-s14" },
  { name: "s15", valuePx: 1440, widthClass: "w-s15" },
];

function SpacingBar({ valuePx, widthClass }: { valuePx: number; widthClass: string }) {
  return (
    <div className="flex items-center gap-s5">
      <div className={`bg-prim h-s4 rounded-sm ${widthClass}`} />
      <Text variant="l3" as="span" className="opacity-60">{valuePx}px</Text>
    </div>
  );
}

const noop = () => {};

const entries: Entry[] = [
  // ─── Colors ───
  ...colorTokens.map<Entry>((c) => ({
    level: "colors",
    label: c.name,
    copy: c.utility,
    variants: [{ label: c.hex, preview: <div className={`size-s9 rounded-xl border border-prim/10 ${c.utility}`} /> }],
  })),

  // ─── Text ───
  {
    level: "text",
    label: "Heading · h2",
    copy: '<Heading variant="h2">Nadpis</Heading>',
    variants: [{ label: "70px", preview: <Heading variant="h2">Nadpis</Heading> }],
  },
  {
    level: "text",
    label: "Heading · h3",
    copy: '<Heading variant="h3">Podnadpis</Heading>',
    variants: [{ label: "32px", preview: <Heading variant="h3">Podnadpis</Heading> }],
  },
  {
    level: "text",
    label: "Heading · numb1",
    copy: '<Heading variant="numb1">2 weeks</Heading>',
    variants: [{ label: "60px", preview: <Heading variant="numb1">2 weeks</Heading> }],
  },
  {
    level: "text",
    label: "Text · h5",
    copy: '<Text variant="h5">Heading five</Text>',
    variants: [{ label: "24px", preview: <Text variant="h5">Heading five</Text> }],
  },
  {
    level: "text",
    label: "Text · p1",
    copy: '<Text variant="p1">Paragraph one</Text>',
    variants: [{ label: "24px", preview: <Text variant="p1">Paragraph one</Text> }],
  },
  {
    level: "text",
    label: "Text · p2",
    copy: '<Text variant="p2">Paragraph two</Text>',
    variants: [{ label: "20px", preview: <Text variant="p2">Paragraph two</Text> }],
  },
  {
    level: "text",
    label: "Text · p3",
    copy: '<Text variant="p3">Paragraph three</Text>',
    variants: [{ label: "18px", preview: <Text variant="p3">Paragraph three</Text> }],
  },
  {
    level: "text",
    label: "Text · l1",
    copy: '<Text variant="l1">Label one</Text>',
    variants: [{ label: "18px medium", preview: <Text variant="l1">Label one</Text> }],
  },
  {
    level: "text",
    label: "Text · l2",
    copy: '<Text variant="l2">Label two</Text>',
    variants: [{ label: "16px medium", preview: <Text variant="l2">Label two</Text> }],
  },
  {
    level: "text",
    label: "Text · l3",
    copy: '<Text variant="l3">Label three</Text>',
    variants: [{ label: "15px", preview: <Text variant="l3">Label three</Text> }],
  },

  // ─── Spacing ───
  ...spacingTokens.map<Entry>((s) => ({
    level: "spacing",
    label: s.name,
    copy: `px-${s.name}`,
    variants: [{ label: `${s.valuePx}px`, preview: <SpacingBar valuePx={s.valuePx} widthClass={s.widthClass} /> }],
  })),

  // ─── Icons ───
  ...iconNames.map<Entry>((n) => ({
    level: "icons",
    label: n,
    copy: `<Icon name="${n}" />`,
    variants: [{
      label: n,
      preview: (
        <span className="text-prim inline-flex">
          <Icon name={n} size="md" title={n} />
        </span>
      ),
    }],
  })),
  ...(["linkedin", "instagram", "x"] as const).map<Entry>((p) => ({
    level: "icons",
    label: p,
    copy: `<SocialLink platform="${p}" href="..." />`,
    variants: [{
      label: p,
      preview: <span className="text-prim inline-flex">{SOCIAL_ICONS[p]}</span>,
    }],
  })),

  // ─── Atoms ───
  {
    level: "atoms",
    label: "IconButton",
    copy: '<IconButton icon="chevron-right" label="Akcia" />',
    variants: [{ label: "default", preview: <IconButton icon="chevron-right" label="Akcia" /> }],
  },
  {
    level: "atoms",
    label: "Avatar",
    copy: '<Avatar src="..." alt="..." size={32} />',
    variants: [
      { label: "32", preview: <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&fit=crop" alt="Sample" size={32} /> },
      { label: "48", preview: <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&fit=crop" alt="Sample" size={48} /> },
    ],
  },
  {
    level: "atoms",
    label: "Badge",
    copy: '<Badge variant="ai">AI</Badge>',
    variants: [{ label: "ai", preview: <Badge variant="ai">AI</Badge> }],
  },
  {
    level: "atoms",
    label: "Logo",
    copy: '<Logo size="sm" />',
    variants: [
      { label: "sm", preview: <Logo size="sm" /> },
      { label: "md", preview: <Logo size="md" /> },
    ],
  },

  // ─── Molecules ───
  {
    level: "molecules",
    label: "Button",
    copy: '<Button variant="primary" rightIcon="arrow-right">Button label</Button>',
    variants: [
      {
        label: "primary",
        preview: <Button variant="primary" rightIcon="arrow-right" className="w-[260px]">{"Let's Start"}</Button>,
      },
      {
        label: "secondary",
        preview: <Button variant="secondary" rightIcon="arrow-right" className="w-[260px]">{"Let's Start"}</Button>,
      },
    ],
  },
  {
    level: "molecules",
    label: "NavPrimPill",
    copy: "<NavPrimPill open={open} onToggle={() => setOpen(o => !o)} />",
    variants: [{ label: "default", preview: <NavPrimPillPreview /> }],
  },
  {
    level: "molecules",
    label: "GalleryNav",
    copy: "<GalleryNav count={4} active={active} onPrev={...} onNext={...} onDotClick={...} />",
    variants: [{ label: "default", preview: <GalleryNavPreview /> }],
  },
  {
    level: "molecules",
    label: "Refer",
    copy: '<Refer name="Martin Mroc" role="CDO, Vibe Studio" avatar="/images/martin.png" />',
    variants: [{ label: "default", preview: <Refer name="Martin Mroc" role="CDO, Vibe Studio" avatar="/images/martin.png" /> }],
  },
  {
    level: "molecules",
    label: "StageCard",
    copy: '<StageCard title="Early Product" desc="Building from the ground up, with quality from day one" />',
    variants: [{ label: "default", preview: <StageCard title="Early Product" desc="Building from the ground up, with quality from day one" /> }],
  },
  {
    level: "molecules",
    label: "ServiceCard",
    copy: '<ServiceCard title="..." active={false} onClick={...} onLetStart={...} price="€5K" duration="2 weeks" desc="..." />',
    variants: [
      {
        label: "inactive",
        preview: <ServiceCard title="Product Sprint" desc="A short, focused sprint to identify key frictions and define improvements." price="€5K" duration="2 weeks" active={false} onClick={noop} onLetStart={noop} />,
      },
      {
        label: "active",
        preview: <ServiceCard title="Product Sprint" desc="A short, focused sprint to identify key frictions and define improvements." price="€5K" duration="2 weeks" active={true} onClick={noop} onLetStart={noop} />,
      },
    ],
  },
  {
    level: "molecules",
    label: "StatColumn",
    copy: '<StatColumn value="2 weeks" label="Avg. time to first value" />',
    variants: [
      {
        label: "+ Refer",
        preview: <StatColumn value="33%" label="Increase in weekly active user retention" refer={{ name: "Milan Tibansky", role: "Growth Lead", avatar: "/images/milan.png" }} />,
      },
      { label: "plain", preview: <StatColumn value="2 weeks" label="Avg. time to first value" /> },
    ],
  },
  {
    level: "molecules",
    label: "SocialLink",
    copy: '<SocialLink platform="linkedin" href="https://linkedin.com" />',
    variants: [
      { label: "linkedin", preview: <SocialLink platform="linkedin" href="https://linkedin.com" /> },
      { label: "instagram", preview: <SocialLink platform="instagram" href="https://instagram.com" /> },
      { label: "x", preview: <SocialLink platform="x" href="https://x.com" /> },
    ],
  },
];

const tabs: { id: Level; label: string }[] = [
  { id: "colors", label: "Colors" },
  { id: "text", label: "Text" },
  { id: "spacing", label: "Spacing" },
  { id: "icons", label: "Icons" },
  { id: "atoms", label: "Atoms" },
  { id: "molecules", label: "Molecules" },
];

const levelLayout: Record<Level, "row" | "grid" | "stack"> = {
  colors: "row",
  text: "stack",
  spacing: "stack",
  icons: "grid",
  atoms: "stack",
  molecules: "stack",
};

function EntryItem({ entry }: { entry: Entry }) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeVariant, setActiveVariant] = useState(0);
  const hasVariants = entry.variants.length > 1;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(entry.copy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard blocked */ }
  };

  return (
    <article
      className="relative inline-flex flex-col pt-s7"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`absolute top-0 left-0 inline-flex items-center gap-s4 px-s5 py-s4 rounded-pill bg-prim text-white transition-opacity duration-200 z-10 shadow-elevated whitespace-nowrap ${hovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <span className="font-body text-l3">{entry.label}</span>

        {hasVariants && (
          <div className="flex items-center gap-s3 border-l border-white/20 pl-s4">
            {entry.variants.map((v, i) => (
              <button
                key={v.label}
                type="button"
                onClick={() => setActiveVariant(i)}
                className={`font-body text-l3 px-s4 py-[3px] rounded-pill cursor-pointer transition-colors ${activeVariant === i ? "bg-white/20" : "text-white/50 hover:text-white"}`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleCopy}
          title={copied ? "Copied!" : "Copy"}
          className="cursor-pointer border-l border-white/20 pl-s4"
        >
          <Icon name={copied ? "check" : "copy"} size="sm" />
        </button>
      </div>

      <div>{entry.variants[activeVariant].preview}</div>
    </article>
  );
}

export default function CatalogPage() {
  const [active, setActive] = useState<Level>("colors");
  const items = entries.filter((e) => e.level === active);
  const layout = levelLayout[active];

  return (
    <main className="mx-auto w-full max-w-s14 px-s9 pt-s10 pb-s8 flex flex-col gap-s8">
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

      <section className="flex flex-col gap-s7">
        {layout === "row" ? (
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
