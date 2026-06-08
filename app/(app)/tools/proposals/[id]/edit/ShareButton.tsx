"use client";

import { useState } from "react";
import { Icon } from "@/app/components/atoms";
import {
  shareProposalAction,
  getShareEmailTemplateAction,
  sendProposalEmailAction,
} from "../../actions";

type Tab = "link" | "email";

export function ShareButton({ proposalPageId }: { proposalPageId: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("link");

  // ── Link tab state ──────────────────────────────────────────────────────────
  const [url, setUrl] = useState<string | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Email tab state ─────────────────────────────────────────────────────────
  const [emailLoaded, setEmailLoaded] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<"sent" | "error" | null>(null);
  const [sendError, setSendError] = useState("");

  // ── Open / generate share URL ───────────────────────────────────────────────
  async function onShareClick() {
    setOpen(true);
    if (url) return;
    setLinkLoading(true);
    try {
      const { shareUrl } = await shareProposalAction(proposalPageId);
      setUrl(shareUrl);
    } finally {
      setLinkLoading(false);
    }
  }

  // ── Copy link ───────────────────────────────────────────────────────────────
  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  // ── Load email template on first open of Email tab ─────────────────────────
  async function onEmailTab() {
    setTab("email");
    setSendResult(null);
    if (emailLoaded) return;
    setEmailLoading(true);
    try {
      const tpl = await getShareEmailTemplateAction(proposalPageId);
      setSubject(tpl.subject);
      setBody(tpl.body);
      if (!url) setUrl(tpl.shareUrl);
      setEmailLoaded(true);
    } finally {
      setEmailLoading(false);
    }
  }

  // ── Send email ──────────────────────────────────────────────────────────────
  async function onSend() {
    if (!to.trim() || !subject.trim() || !body.trim()) return;
    setSending(true);
    setSendResult(null);
    const res = await sendProposalEmailAction(proposalPageId, to.trim(), subject, body);
    setSending(false);
    if (res.ok) {
      setSendResult("sent");
      setTo("");
    } else {
      setSendResult("error");
      setSendError(res.error);
    }
  }

  // ── Close ───────────────────────────────────────────────────────────────────
  function close() {
    setOpen(false);
    setTab("link");
    setSendResult(null);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onShareClick}
        className="inline-flex items-center gap-s1 h-s6 px-s3 rounded-pill border border-prim/15 text-prim font-body font-medium text-l2 hover:border-prim/30 transition-colors cursor-pointer"
      >
        Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={close} />

          <div className="absolute z-30 top-[calc(100%+6px)] right-0 w-[380px] rounded-lg bg-white border border-prim/10 shadow-lg overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-prim/8">
              {(["link", "email"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={t === "email" ? onEmailTab : () => setTab("link")}
                  className={`flex-1 py-s2 font-body font-medium text-l2 transition-colors capitalize ${
                    tab === t
                      ? "text-prim border-b-2 border-prim -mb-px"
                      : "text-prim/40 hover:text-prim/70"
                  }`}
                >
                  {t === "link" ? "Copy link" : "Send by email"}
                </button>
              ))}
            </div>

            {/* ── Link tab ─────────────────────────────────────────────────── */}
            {tab === "link" && (
              <div className="p-s3 flex flex-col gap-s2">
                <span className="font-body text-l3 text-prim/45">
                  Anyone with this link can view the proposal.
                </span>
                <div className="flex items-center gap-s1">
                  <input
                    readOnly
                    value={linkLoading ? "Generating…" : url ?? ""}
                    onFocus={(e) => e.currentTarget.select()}
                    className="flex-1 h-s6 px-s2 rounded-md border border-prim/15 bg-surface font-body text-l3 text-prim/80 outline-none"
                  />
                  <button
                    type="button"
                    onClick={copy}
                    disabled={!url}
                    aria-label="Copy link"
                    className="grid place-items-center size-s6 rounded-md bg-prim text-white hover:opacity-85 disabled:opacity-40 transition-opacity cursor-pointer"
                  >
                    <Icon name={copied ? "check" : "copy"} size="sm" />
                  </button>
                </div>
              </div>
            )}

            {/* ── Email tab ─────────────────────────────────────────────────── */}
            {tab === "email" && (
              <div className="p-s3 flex flex-col gap-s2">
                {emailLoading ? (
                  <span className="font-body text-l3 text-prim/40 py-s4 text-center">Loading template…</span>
                ) : (
                  <>
                    {/* To */}
                    <label className="flex flex-col gap-s1">
                      <span className="font-body text-l3 text-prim/55">To</span>
                      <input
                        type="email"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="client@example.com"
                        className="h-s6 px-s2 rounded-md border border-prim/15 bg-white font-body text-l2 text-prim outline-none focus:border-brand transition-colors"
                      />
                    </label>

                    {/* Subject */}
                    <label className="flex flex-col gap-s1">
                      <span className="font-body text-l3 text-prim/55">Subject</span>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="h-s6 px-s2 rounded-md border border-prim/15 bg-white font-body text-l2 text-prim outline-none focus:border-brand transition-colors"
                      />
                    </label>

                    {/* Body */}
                    <label className="flex flex-col gap-s1">
                      <span className="font-body text-l3 text-prim/55">Message</span>
                      <textarea
                        rows={7}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="px-s2 py-s1 rounded-md border border-prim/15 bg-white font-body text-l2 text-prim outline-none focus:border-brand transition-colors resize-none leading-relaxed"
                      />
                    </label>

                    {/* Feedback */}
                    {sendResult === "sent" && (
                      <div className="flex items-center gap-s1 text-green-600 font-body text-l3">
                        <Icon name="check" size="sm" />
                        Email sent successfully.
                      </div>
                    )}
                    {sendResult === "error" && (
                      <span className="font-body text-l3 text-red-500">{sendError}</span>
                    )}

                    {/* Send button */}
                    <button
                      type="button"
                      onClick={onSend}
                      disabled={sending || !to.trim() || !subject.trim()}
                      className="self-start inline-flex items-center gap-s1 h-s6 px-s4 rounded-pill bg-prim text-white font-body font-medium text-l2 hover:opacity-85 disabled:opacity-40 transition-opacity cursor-pointer"
                    >
                      {sending ? "Sending…" : "Send email"}
                      {!sending && <Icon name="arrow-right" size="sm" />}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
