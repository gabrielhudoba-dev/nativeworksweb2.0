"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/components/atoms";
import {
  createProposalAction,
  searchClientsAction,
  clientProposalNumberAction,
  type NewProposalInput,
} from "../actions";

const DASH = "—";

type ClientResult = { pageId: string; companyName: string };

type Selected =
  | { mode: "existing"; pageId: string; companyName: string }
  | { mode: "new"; companyName: string; pocName: string; pocEmail: string; pocPhone: string };

export function NewProposalForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ClientResult[]>([]);
  const [searching, setSearching] = useState(false);

  const [selected, setSelected] = useState<Selected | null>(null);
  const [title, setTitle] = useState("");
  const [titleTouched, setTitleTouched] = useState(false);

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced client search.
  useEffect(() => {
    if (selected || query.trim().length < 1) {
      setResults([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        setResults(await searchClientsAction(query));
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, selected]);

  async function pickExisting(c: ClientResult) {
    setSelected({ mode: "existing", pageId: c.pageId, companyName: c.companyName });
    setQuery("");
    setResults([]);
    // Default name = "Company — N" where N = existing proposals + 1.
    const n = await clientProposalNumberAction(c.pageId).catch(() => 1);
    setTitle(`${c.companyName} ${DASH} ${n}`);
    setTitleTouched(false);
  }

  function pickNew() {
    const name = query.trim();
    setSelected({ mode: "new", companyName: name, pocName: "", pocEmail: "", pocPhone: "" });
    setQuery("");
    setResults([]);
    setTitle(name ? `${name} ${DASH} 1` : "");
    setTitleTouched(false);
  }

  function resetClient() {
    setSelected(null);
    setTitle("");
    setTitleTouched(false);
  }

  function setNewCompany(name: string) {
    if (!selected || selected.mode !== "new") return;
    setSelected({ ...selected, companyName: name });
    if (!titleTouched) setTitle(name ? `${name.trim()} ${DASH} 1` : "");
  }

  async function submit() {
    if (!selected || !title.trim()) return;
    setError(null);
    setCreating(true);

    const input: NewProposalInput =
      selected.mode === "existing"
        ? { title, client: { mode: "existing", pageId: selected.pageId, companyName: selected.companyName } }
        : {
            title,
            client: {
              mode: "new",
              companyName: selected.companyName,
              pocName: selected.pocName,
              pocEmail: selected.pocEmail,
              pocPhone: selected.pocPhone,
            },
          };

    try {
      await createProposalAction(input);
      // On success the action redirects; this component unmounts.
    } catch (e) {
      setCreating(false);
      setError(e instanceof Error ? e.message : "Could not create proposal");
    }
  }

  const canCreate =
    !!selected &&
    title.trim().length > 0 &&
    (selected.mode === "existing" || selected.companyName.trim().length > 0);

  return (
    <div className="flex flex-col gap-s6">
      {/* ── Client ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-s2">
        <span className="font-body font-medium text-l2 text-prim/70">Client</span>

        {!selected && (
          <div className="relative flex flex-col gap-s1">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clients…"
              className="h-s7 px-s3 rounded-md border border-prim/15 bg-white font-body text-p2 text-prim outline-none focus:border-brand transition-colors"
            />
            {query.trim().length > 0 && (
              <div className="flex flex-col rounded-md border border-prim/10 overflow-hidden">
                {results.map((c) => (
                  <button
                    key={c.pageId}
                    type="button"
                    onClick={() => pickExisting(c)}
                    className="text-left px-s3 py-s2 font-body text-p3 text-prim hover:bg-surface transition-colors cursor-pointer"
                  >
                    {c.companyName}
                  </button>
                ))}
                {!searching && results.length === 0 && (
                  <span className="px-s3 py-s2 font-body text-l3 text-prim/40">No matches</span>
                )}
                <button
                  type="button"
                  onClick={pickNew}
                  className="flex items-center gap-s1 text-left px-s3 py-s2 font-body text-p3 text-brand hover:bg-brand/5 border-t border-prim/8 transition-colors cursor-pointer"
                >
                  <span className="grid place-items-center size-s3 rounded-pill bg-brand/10 text-[16px] leading-none">+</span>
                  Create new client “{query.trim()}”
                </button>
              </div>
            )}
          </div>
        )}

        {selected?.mode === "existing" && (
          <div className="flex items-center justify-between h-s7 px-s3 rounded-md border border-prim/15 bg-surface">
            <span className="font-body text-p3 text-prim">{selected.companyName}</span>
            <button type="button" onClick={resetClient} className="font-body text-l2 text-prim/45 hover:text-prim transition-colors cursor-pointer">
              Change
            </button>
          </div>
        )}

        {selected?.mode === "new" && (
          <div className="flex flex-col gap-s2 p-s3 rounded-md border border-brand/30 bg-brand/[0.03]">
            <div className="flex items-center justify-between">
              <span className="font-body font-medium text-l2 text-brand">New client</span>
              <button type="button" onClick={resetClient} className="font-body text-l2 text-prim/45 hover:text-prim transition-colors cursor-pointer">
                Change
              </button>
            </div>
            <label className="flex flex-col gap-s1">
              <span className="font-body text-l3 text-prim/55">Company name *</span>
              <input
                value={selected.companyName}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Company s.r.o."
                className="h-s6 px-s2 rounded-md border border-prim/15 bg-white font-body text-p3 text-prim outline-none focus:border-brand transition-colors"
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-s1">
              <NewField label="POC name" value={selected.pocName} onChange={(v) => setSelected({ ...selected, pocName: v })} />
              <NewField label="POC email" type="email" value={selected.pocEmail} onChange={(v) => setSelected({ ...selected, pocEmail: v })} />
              <NewField label="POC phone" type="tel" value={selected.pocPhone} onChange={(v) => setSelected({ ...selected, pocPhone: v })} />
            </div>
            <span className="font-body text-l3 text-prim/40">
              Only the company name is required. The POC is saved to People; the rest is filled in when the client confirms.
            </span>
          </div>
        )}
      </section>

      {/* ── Proposal name ──────────────────────────────────────────────────── */}
      {selected && (
        <section className="flex flex-col gap-s1">
          <span className="font-body font-medium text-l2 text-prim/70">Proposal name</span>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleTouched(true);
            }}
            placeholder={`Company ${DASH} 1`}
            className="h-s7 px-s3 rounded-md border border-prim/15 bg-white font-body text-p2 text-prim outline-none focus:border-brand transition-colors"
          />
          <span className="font-body text-l3 text-prim/40">
            Defaults to “{DASH} number” — replace the number with a project name if you like.
          </span>
        </section>
      )}

      {error && <span className="font-body text-l2 text-red-500">{error}</span>}

      {/* ── Actions ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-s3">
        <button
          type="button"
          onClick={submit}
          disabled={!canCreate || creating}
          className="inline-flex items-center gap-s1 h-s7 px-s4 rounded-pill bg-prim text-white font-body font-medium text-l1 hover:opacity-85 disabled:opacity-40 disabled:cursor-default transition-opacity cursor-pointer"
        >
          {creating ? "Creating…" : "Create & edit"}
          {!creating && <Icon name="arrow-right" size="sm" />}
        </button>
        <Link href="/tools" className="font-body text-l1 text-prim/50 hover:text-prim transition-colors">
          Cancel
        </Link>
      </div>
    </div>
  );
}

function NewField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-s1">
      <span className="font-body text-l3 text-prim/55">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-s6 px-s2 rounded-md border border-prim/15 bg-white font-body text-p3 text-prim outline-none focus:border-brand transition-colors"
      />
    </label>
  );
}
