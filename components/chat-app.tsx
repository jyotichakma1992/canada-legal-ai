"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useLanguage } from "@/components/language-provider";
import { TermsArticles } from "@/components/static-pages";
import { areasFor, examplesFor, questionInLang } from "@/lib/areas";
import type { Lang } from "@/lib/language";
import { TERMS_CONSENT_COOKIE, TERMS_CONSENT_VALUE } from "@/lib/terms-consent";
import {
  DEFAULT_JURISDICTION,
  JURISDICTIONS,
  type JurisdictionId,
} from "@/lib/jurisdictions";
import { placeName, translateError } from "@/lib/ui";
import type { ChatMessage } from "@/lib/validate";

const LEGACY_STORAGE_KEYS = ["canada-legal-ai-chat", "canada-legal-ai-question-count"];

export function ChatApp({
  initialJurisdiction,
  initialTermsAccepted = false,
}: {
  initialJurisdiction?: JurisdictionId;
  initialTermsAccepted?: boolean;
}) {
  const { lang, t } = useLanguage();
  const [jurisdiction, setJurisdiction] = useState<JurisdictionId>(
    initialJurisdiction ?? DEFAULT_JURISDICTION,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(initialTermsAccepted);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listId = useId();
  const areas = areasFor(lang);
  const examples = examplesFor(lang);
  const requestSeq = useRef(0);
  const langRef = useRef(lang);
  const messagesRef = useRef(messages);
  const jurisdictionRef = useRef(jurisdiction);
  messagesRef.current = messages;
  jurisdictionRef.current = jurisdiction;

  useEffect(() => {
    try {
      for (const key of LEGACY_STORAGE_KEYS) {
        sessionStorage.removeItem(key);
      }
    } catch {
      // A locked-down browser can refuse sessionStorage. The chat still works in memory.
    }
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || messages.length === 0) return;
    scroller.scrollIntoView({ block: "end" });
  }, [messages, loading, error]);

  useEffect(() => {
    const field = inputRef.current;
    if (!field) return;
    field.style.height = "auto";
    const next = Math.min(Math.max(field.scrollHeight, 128), 220);
    field.style.height = `${next}px`;
    field.style.overflowY = next >= 220 ? "auto" : "hidden";
  }, [draft]);

  async function fetchAnswer(
    nextMessages: ChatMessage[],
    answerLang: Lang,
    seq: number,
  ): Promise<ChatMessage | null> {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jurisdiction: jurisdictionRef.current,
        lang: answerLang,
        messages: nextMessages,
      }),
    });
    if (requestSeq.current !== seq) return null;

    const payload: unknown = await response.json().catch(() => null);
    const answer =
      payload &&
      typeof payload === "object" &&
      "answer" in payload &&
      typeof payload.answer === "string"
        ? payload.answer
        : null;
    const thoughtSignature =
      payload &&
      typeof payload === "object" &&
      "thoughtSignature" in payload &&
      typeof payload.thoughtSignature === "string" &&
      payload.thoughtSignature.length > 0 &&
      payload.thoughtSignature.length <= 16_000
        ? payload.thoughtSignature
        : undefined;
    const serverError =
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : null;

    if (!response.ok || !answer) {
      setError(
        serverError ?? `The chat service returned HTTP ${response.status} with no error message.`,
      );
      return null;
    }

    return {
      role: "assistant",
      content: answer,
      ...(thoughtSignature ? { thoughtSignature } : {}),
    };
  }

  async function requestAnswer(nextMessages: ChatMessage[], answerLang: Lang) {
    const seq = ++requestSeq.current;
    setMessages(nextMessages);
    setError(null);
    setLoading(true);

    try {
      const reply = await fetchAnswer(nextMessages, answerLang, seq);
      if (requestSeq.current !== seq || !reply) return;
      setMessages([...nextMessages, reply]);
    } catch {
      if (requestSeq.current === seq) {
        setError("You appear to be offline, or the server could not be reached.");
      }
    } finally {
      if (requestSeq.current === seq) setLoading(false);
    }
  }

  useEffect(() => {
    const previous = langRef.current;
    if (previous === lang) return;
    langRef.current = lang;
    setDraft((current) => questionInLang(current, lang));

    const users = messagesRef.current
      .filter((message) => message.role === "user")
      .map((message) => ({
        role: "user" as const,
        content: questionInLang(message.content, lang),
      }));
    if (users.length === 0) return;

    const seq = ++requestSeq.current;
    const answerLang = lang;
    const snapshot = messagesRef.current;
    let history: ChatMessage[] = [];

    async function rewrite() {
      setError(null);
      setLoading(true);
      try {
        for (const user of users) {
          if (requestSeq.current !== seq) return;
          history = [...history, user];
          setMessages(history);
          const reply = await fetchAnswer(history, answerLang, seq);
          if (requestSeq.current !== seq) return;
          if (!reply) {
            setMessages(snapshot);
            return;
          }
          history = [...history, reply];
          setMessages(history);
        }
      } catch {
        if (requestSeq.current === seq) {
          setMessages(snapshot);
          setError("You appear to be offline, or the server could not be reached.");
        }
      } finally {
        if (requestSeq.current === seq) setLoading(false);
      }
    }

    void rewrite();
  }, [lang]);

  function agreeToTerms() {
    document.cookie = `${TERMS_CONSENT_COOKIE}=${TERMS_CONSENT_VALUE}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setAccepted(true);
  }

  function sendQuestion(text: string) {
    const question = text.trim();
    if (!accepted || !question || loading) return;
    if (messages.length >= 20) {
      setError("This conversation is too long. Start a new chat to continue.");
      return;
    }

    setDraft("");
    void requestAnswer([...messages, { role: "user", content: question }], lang);
  }

  function retry() {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "user" || loading) return;
    void requestAnswer(messages, lang);
  }

  function resetChat() {
    setMessages([]);
    setError(null);
    setDraft("");
    inputRef.current?.focus();
  }

  function fillQuestion(text: string) {
    if (!accepted || loading) return;
    setDraft(text);
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ block: "center" });
  }

  const canSend = accepted && draft.trim().length > 0 && !loading;
  const canRetry = accepted && !loading && messages[messages.length - 1]?.role === "user";
  const askingDisabled = !accepted || loading;

  return (
    <div className={`mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 ${accepted ? "" : "pb-40"}`}>
      <div
        className={`grid items-start gap-6 ${messages.length === 0 ? "lg:grid-cols-[minmax(0,1fr)_19rem]" : ""}`}
      >
        {messages.length === 0 ? (
          <div className="order-1 lg:col-start-1 lg:row-start-1">
            <ProductIntro compact={!accepted} />
          </div>
        ) : null}
        {messages.length === 0 ? (
          <WhyPanel className="order-3 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start" />
        ) : null}
        <div
          className={`flex min-w-0 flex-col gap-6 ${messages.length === 0 ? "order-2 lg:col-start-1 lg:row-start-2" : ""}`}
        >
      {accepted ? null : <TermsGate onAgree={agreeToTerms} />}
      <section className="rounded-2xl border border-line bg-white px-5 py-4 shadow-sm" aria-labelledby="province-label">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <label id="province-label" htmlFor="jurisdiction" className="block text-base font-semibold text-navy">
              {t.yourProvince}
            </label>
            <p className="mt-1 text-sm leading-relaxed text-muted">{t.provinceHint}</p>
            <select
              id="jurisdiction"
              value={jurisdiction}
              onChange={(event) => {
                const next = event.target.value;
                if (JURISDICTIONS.some((item) => item.id === next)) {
                  setJurisdiction(next as JurisdictionId);
                }
              }}
              className="jurisdiction-select mt-2 h-12 w-full appearance-none rounded-lg border border-line bg-white px-3 pr-10 text-base text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {JURISDICTIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {placeName(item.id, lang)}
                </option>
              ))}
            </select>
          </div>
          {messages.length > 0 ? (
            <button
              type="button"
              onClick={resetChat}
              className="text-sm text-accent underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t.newChat}
            </button>
          ) : null}
        </div>
      </section>

      <div id={listId} ref={scrollerRef} aria-live="polite" className={messages.length === 0 ? "hidden" : ""}>
        {messages.length === 0 ? null : (
          <div className="flex flex-col gap-8">
            {messages.map((message, index) =>
              message.role === "user" ? (
                <div key={`${message.role}-${index}`} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl bg-navy px-4 py-3 text-base leading-relaxed whitespace-pre-wrap text-white">
                    {message.content}
                  </p>
                </div>
              ) : (
                <article
                  key={`${message.role}-${index}`}
                  className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6"
                >
                  <p className="mb-3 font-serif text-lg text-navy">{t.siteName}</p>
                  <div className="legal-answer">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: SafeLink,
                        img: () => null,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-ink">{t.answerNotice}</p>
                </article>
              ),
            )}
            {loading ? <Thinking /> : null}
          </div>
        )}
      </div>

      {accepted ? (
      <form
        className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          sendQuestion(draft);
        }}
      >
        <p className="mb-3 text-[13px] leading-relaxed text-muted">
          {t.disclaimer}{" "}
          <Link
            href="/terms"
            className="text-accent underline underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t.terms}
          </Link>
        </p>
        {error ? (
          <div className="mb-3 rounded-lg border border-line bg-mist px-3 py-3" role="alert">
            <p className="text-sm leading-relaxed text-navy">{translateError(error, lang)}</p>
            {canRetry ? (
              <button
                type="button"
                onClick={retry}
                className="mt-2 text-sm font-medium text-accent underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t.tryAgain}
              </button>
            ) : null}
          </div>
        ) : null}
        <p className="mb-2 text-sm leading-relaxed text-muted">{t.questionHint}</p>
        <p className="mb-2 text-sm leading-relaxed text-ink">{t.sentToGoogle}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <label htmlFor="question" className="sr-only">
            {t.placeholder}
          </label>
          <textarea
            id="question"
            ref={inputRef}
            value={draft}
            rows={4}
            maxLength={4000}
            placeholder={t.placeholder}
            disabled={askingDisabled}
            autoComplete="off"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendQuestion(draft);
              }
            }}
            className="max-h-56 min-h-32 w-full resize-none rounded-xl border border-line bg-white px-4 py-3 text-base leading-6 text-ink outline-none placeholder:text-muted focus:border-accent disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-cta px-6 text-base font-semibold text-white transition hover:bg-cta-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 sm:h-auto sm:min-w-28"
          >
            {t.send}
            <SendIcon />
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">{t.enterHint}</p>
      </form>
      ) : null}

      {accepted && messages.length === 0 ? (
        <>
          <section aria-labelledby="examples-heading">
            <h2 id="examples-heading" className="text-sm font-semibold text-navy">
              {t.examples}
            </h2>
            <p className="mt-1 text-sm text-muted">{draft.trim() ? t.filled : t.empty}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {examples.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => fillQuestion(question)}
                  disabled={askingDisabled}
                  className="min-h-11 rounded-full border border-line bg-white px-4 py-2 text-left text-sm text-navy shadow-sm transition hover:border-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="areas-heading">
            <h2 id="areas-heading" className="font-serif text-2xl tracking-tight text-navy">
              {t.areas}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{t.areasHint}</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {areas.map((area) => (
                <li key={area.id}>
                  <button
                    type="button"
                    onClick={() => fillQuestion(area.question)}
                    disabled={askingDisabled}
                    className="h-full w-full rounded-xl border border-line bg-white px-4 py-3 text-left shadow-sm transition hover:border-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
                  >
                    <span className="block text-sm font-semibold text-navy">{area.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{area.question}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
        </div>
      </div>
    </div>
  );
}

function TermsGate({ onAgree }: { onAgree: () => void }) {
  const { t } = useLanguage();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [readToEnd, setReadToEnd] = useState(false);

  function markIfRead(el: HTMLDivElement) {
    if (el.scrollHeight - el.clientHeight <= 12) {
      setReadToEnd(true);
      return;
    }
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 12) setReadToEnd(true);
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) markIfRead(el);
  }, []);

  return (
    <>
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6" aria-labelledby="terms-gate-heading">
      <h2 id="terms-gate-heading" className="font-serif text-2xl tracking-tight text-navy">
        {t.termsGateTitle}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{t.scrollTerms}</p>
      <div
        ref={scrollerRef}
        tabIndex={0}
        onScroll={(event) => markIfRead(event.currentTarget)}
        className="page-prose mt-3 max-h-48 overflow-y-auto rounded-xl border border-line px-4 py-2 sm:max-h-56"
      >
        <TermsArticles />
      </div>
      <p className="mt-3 text-sm">
        <Link
          href="/terms"
          className="text-accent underline underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t.terms}
        </Link>
      </p>
    </section>
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="hidden text-sm leading-relaxed text-ink sm:block">{readToEnd ? t.agreeReady : t.scrollTerms}</p>
        <button
          type="button"
          disabled={!readToEnd}
          onClick={onAgree}
          className={`inline-flex min-h-12 w-full items-center justify-center rounded-xl px-5 py-3 text-left text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto ${
            readToEnd
              ? "bg-cta text-white hover:bg-cta-hover"
              : "cursor-not-allowed border-2 border-navy bg-white text-navy"
          }`}
        >
          {t.agreeTerms}
        </button>
      </div>
    </div>
    </>
  );
}

function ProductIntro({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  if (compact) {
    return (
      <section className="sm:rounded-2xl sm:border sm:border-line sm:bg-white sm:px-6 sm:py-5 sm:shadow-sm">
        <h1 className="font-serif text-3xl leading-tight tracking-tight text-navy">{t.homeHeading}</h1>
        <p className="mt-2 hidden max-w-2xl text-base leading-relaxed text-ink sm:block">{t.homeSubtitle}</p>
      </section>
    );
  }
  return (
    <section className="rounded-2xl border border-line bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-9">
      <p className="text-xs font-semibold tracking-[0.14em] text-navy uppercase">{t.forAnyone}</p>
      <h1 className="mt-3 max-w-2xl font-serif text-[2rem] leading-tight tracking-tight text-navy sm:text-4xl">
        {t.homeHeading}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink">{t.homeSubtitle}</p>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{t.audienceLine}</p>
    </section>
  );
}

function WhyPanel({ className = "" }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <aside className={`rounded-2xl border border-line bg-white p-5 shadow-sm ${className}`}>
      <h2 className="font-serif text-xl tracking-tight text-navy">{t.whyTitle}</h2>
      <ul className="mt-4 flex flex-col gap-4">
        {t.why.map((item) => (
          <li key={item.title} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
            <p className="text-sm font-semibold text-navy">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{item.text}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Thinking() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-3 text-sm text-muted" role="status">
      <span className="flex gap-1" aria-hidden="true">
        <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      {t.thinking}
    </div>
  );
}

function SafeLink({
  href,
  children,
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  if (!href || !/^https?:\/\//i.test(href)) {
    return <span>{children}</span>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 10h12M11 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
