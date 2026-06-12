import { supabase } from "./supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SiteContent = Record<string, string>;

export type Member = {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  logos: string[] | null;
  col: 1 | 2 | 3;
  row: number;
};

export type Company = {
  id: number;
  name: string;
  logo: string | null;
  dark: boolean;
  sort_order: number;
};

export type Service = {
  id: number;
  title: string;
  desc: string;
  price: string;
  duration: string;
  sort_order: number;
};

export type Stage = {
  id: number;
  title: string;
  desc: string;
  sort_order: number;
};

export type Stat = {
  id: number;
  value: string;
  label: string;
  refer_name: string | null;
  refer_role: string | null;
  refer_avatar: string | null;
  sort_order: number;
};

export type CapabilitySection = {
  id: number;
  title: string;
  sort_order: number;
  items: string[];
};

export type CaseStudyItemStat = {
  value: string;
  label: string;
};

export type CaseStudyAuthor = { name: string; role: string; avatar?: string };

export type CaseStudyDbItem = {
  id: number;
  type: "case_study" | "stats" | "text" | "image";
  sort_order: number;
  variant: string | null;
  title: string | null;
  description: string | null;
  image_src: string | null;
  image_alt: string | null;
  author_name: string | null;
  author_role: string | null;
  author_avatar: string | null;
  /** Parsed authors — supports several per item via a "|" delimiter in the
   *  author_name/role/avatar columns (e.g. "A|B"), since the table has no
   *  second-author columns. Single author = one entry. */
  authors: CaseStudyAuthor[];
  stats: CaseStudyItemStat[];
};

// ─── Table name map ───────────────────────────────────────────────────────────

const CONTENT_TABLE: Record<string, string> = {
  "global":       "0_global",
  "home":         "1_home",
  "collective":   "2_collective",
  "capabilities": "3_capabilities",
  "case-studies": "4_case_studies",
};

// ─── Fetch functions ─────────────────────────────────────────────────────────

/** Fetch key/value content for a given page. Keys are `section_key`. */
export async function getContent(page: string): Promise<SiteContent> {
  const table = CONTENT_TABLE[page];

  const { data, error } = await supabase
    .from(table)
    .select("section, key, value")
    .order("sort_order");

  if (error) {
    console.error(`Supabase content error (${table}):`, error.message);
    return {};
  }

  return Object.fromEntries(
    (data ?? []).map(({ section, key, value }) => [`${section}_${key}`, value])
  );
}

export async function getGlobalContent(): Promise<SiteContent> {
  return getContent("global");
}

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from("2_collective_members")
    .select("*")
    .order("row")
    .order("col");

  if (error) {
    console.error("Supabase members error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCollectiveCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from("2_collective_companies")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Supabase companies error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("1_home_services")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Supabase services error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getStages(): Promise<Stage[]> {
  const { data, error } = await supabase
    .from("1_home_stages")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Supabase stages error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getStats(): Promise<Stat[]> {
  const { data, error } = await supabase
    .from("1_home_stats")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Supabase stats error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCapabilitiesSections(): Promise<CapabilitySection[]> {
  const [{ data: sections, error: sErr }, { data: items, error: iErr }] =
    await Promise.all([
      supabase.from("3_capabilities_sections").select("id, title, sort_order").order("sort_order"),
      supabase.from("3_capabilities_section_items").select("section_id, text, sort_order").order("sort_order"),
    ]);

  if (sErr) { console.error("Supabase capabilities sections error:", sErr.message); return []; }
  if (iErr) { console.error("Supabase capabilities items error:", iErr.message); return []; }

  return (sections ?? []).map((s) => ({
    ...s,
    items: (items ?? []).filter((i) => i.section_id === s.id).map((i) => i.text),
  }));
}

export async function getCaseStudiesItems(): Promise<CaseStudyDbItem[]> {
  const [{ data: itemRows, error: iErr }, { data: statRows, error: sErr }] =
    await Promise.all([
      supabase.from("4_case_studies_items").select("*").order("sort_order"),
      supabase.from("4_case_studies_item_stats").select("item_id, value, label, sort_order").order("sort_order"),
    ]);

  if (iErr) { console.error("Supabase case studies items error:", iErr.message); return []; }
  if (sErr) { console.error("Supabase case studies stats error:", sErr.message); return []; }

  return (itemRows ?? []).map((item) => ({
    ...item,
    authors: parseAuthors(item),
    stats: (statRows ?? []).filter((s) => s.item_id === item.id),
  }));
}

/** Split the author_name/role/avatar columns on "|" into one or more authors. */
function parseAuthors(item: {
  author_name: string | null;
  author_role: string | null;
  author_avatar: string | null;
}): CaseStudyAuthor[] {
  if (!item.author_name) return [];
  const names = item.author_name.split("|").map((s) => s.trim());
  const roles = (item.author_role ?? "").split("|").map((s) => s.trim());
  const avatars = (item.author_avatar ?? "").split("|").map((s) => s.trim());
  return names
    .map((name, i) => ({ name, role: roles[i] ?? "", avatar: avatars[i] || undefined }))
    .filter((a) => a.name);
}
