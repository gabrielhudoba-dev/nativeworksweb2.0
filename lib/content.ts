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

// ─── Fetch functions ─────────────────────────────────────────────────────────

/** Fetch all key/value content rows and return as a plain object */
export async function getContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from("content")
    .select("key, value");

  if (error) {
    console.error("Supabase content error:", error.message);
    return {};
  }

  return Object.fromEntries((data ?? []).map(({ key, value }) => [key, value]));
}

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("row")
    .order("col");

  if (error) {
    console.error("Supabase members error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
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
    .from("stages")
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
    .from("stats")
    .select("*")
    .order("sort_order");

  if (error) {
    console.error("Supabase stats error:", error.message);
    return [];
  }
  return data ?? [];
}
