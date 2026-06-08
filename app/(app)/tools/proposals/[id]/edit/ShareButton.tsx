"use client";

import { useState } from "react";
import { Icon } from "@/app/components/atoms";
import { Field, Input, Textarea } from "@/app/(app)/components/FormField";
import { AppButton } from "@/app/(app)/components/AppButton";
import {
  shareProposalAction,
  getShareEmailTemplateAction,
  sendProposalEmailAction,
} from "../../actions";

type Tab = "link" | "email";

export function ShareButton({ proposalPageId }: { proposalPageId: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("link");

  // ── Link tab ────────────────────────────────────────────────────────────────
  const [url, setUrl] = useState<string | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Email tab ───────────────────────────────────────────────────────────────
  const [emailLoaded, setEmailLoaded] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<"sent" | "error" | null>(null);
  const [sendError, setSendError] = useState("");

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

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard blocked */ }
  }

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

  async function onSend() {
    if (!to.trim() || !subject.trim() || !body.trim()) return;
    setSending(true);
    setSendResult(null);
    const res = await sendProposalEmailAction(proposalPageId, to.trim(), subject, body);
    setSending(false);
    if (res.ok) { setSendResult("sent"); setTo(""); }
    else { setSendResult("error"); setSendError(res.error); }
  }

  function close() { setOpen(false); setTab("link"); setSendResult(null); }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onShareClick}
        className="inline-flex items-center gap-s1 pb-px h-s5 px-s3 rounded-pill bg-prim/8 text-prim font-body font-medium text-l1 hover:bg-prim/14 transition-colors cursor-pointer"
      >
        <Icon name="share" size="sm" />
        Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={close} />

          {/* Popover — shadow-elevated from token, w-form = 560px capped at viewport */}
          <div className="absolute z-30 top-[calc(100%+s1)] right-0 w-[380px] max-w-[calc(100vw-s4)] rounded-lg bg-white border border-prim/10 shadow-elevated overflow-hidden flex flex-col">

            {/* ── Tabs ─────────────────────────────────────────────────────── */}
            <div className="flex border-b border-prim/8">
              {(["link", "email"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={t === "email" ? onEmailTab : () => setTab("link")}
                  className={`flex-1 py-s2 font-body font-medium text-l2 transition-colors ${
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
                  <Input
                    readOnly
                    value={linkLoading ? "Generating…" : url ?? ""}
                    onChange={() => {}}
                    onFocus={(e) => e.currentTarget.select()}
                    size="sm"
                  />
                  <button
                    type="button"
                    onClick={copy}
                    disabled={!url}
                    aria-label="Copy link"
                    className="grid place-items-center size-s6 rounded-md bg-prim text-white hover:opacity-85 disabled:opacity-40 transition-opacity shrink-0 cursor-pointer"
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
                  <span className="font-body text-l3 text-prim/40 py-s4 text-center">
                    Loading template…
                  </span>
                ) : (
                  <>
                    <Field label="To" required>
                      <Input type="email" value={to} onChange={setTo} placeholder="client@example.com" size="sm" />
                    </Field>
                    <Field label="Subject">
                      <Input value={subject} onChange={setSubject} size="sm" />
                    </Field>
                    <Field label="Message">
                      <Textarea value={body} onChange={setBody} rows={7} />
                    </Field>

                    {sendResult === "sent" && (
                      <div className="flex items-center gap-s1 text-success font-body text-l3">
                        <Icon name="check" size="sm" />
                        Email sent successfully.
                      </div>
                    )}
                    {sendResult === "error" && (
                      <span className="font-body text-l3 text-error">{sendError}</span>
                    )}

                    <AppButton
                      variant="primary"
                      size="sm"
                      loading={sending}
                      loadingText="Sending…"
                      disabled={!to.trim() || !subject.trim()}
                      onClick={onSend}
                      className="self-start"
                    >
                      Send email
                      <Icon name="arrow-right" size="sm" />
                    </AppButton>
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
