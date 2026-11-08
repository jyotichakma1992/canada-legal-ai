"use client";

import { useEffect, useId, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useLanguage } from "@/components/language-provider";
import { areasFor, examplesFor } from "@/lib/areas";
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
}: {
  initialJurisdiction?: JurisdictionId;
}) {
  const { lang, t, setChatJurisdiction } = useLanguage();
  const [jurisdiction, setJurisdiction] = useState<JurisdictionId>(
    initialJurisdiction ?? DEFAULT_JURISDICTION,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listId = useId();
  const areas = areasFor(lang);
  const examples = examplesFor(lang);

  useEffect(() => {
    setChatJurisdiction(jurisdiction);
    return () => setChatJurisdiction(null);
  }, [jurisdiction, setChatJurisdiction]);

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

  async function requestAnswer(nextMessages: ChatMessage[]) {
    setMessages(nextMessages);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jurisdiction,
          messages: nextMessages,
        }),
      });

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
            (serverError ??
              `The chat service returned HTTP ${response.status} with no error message.`),
        );
        return;
      }

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: answer,
          ...(thoughtSignature ? { thoughtSignature } : {}),
        },
      ]);
    } catch {
      setError("You appear to be offline, or the server could not be reached.");
    } finally {
      setLoading(false);
    }
  }

  function sendQuestion(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    if (messages.length >= 20) {
      setError("This conversation is too long. Start a new chat to continue.");
      return;
    }

    setDraft("");
    void requestAnswer([...messages, { role: "user", content: question }]);
  }

  function retry() {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "user" || loading) return;
    void requestAnswer(messages);
  }

  function resetChat() {
    setMessages([]);
    setError(null);
    setDraft("");
    inputRef.current?.focus();
  }

  function fillQuestion(text: string) {
    if (loading) return;
    setDraft(text);
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ block: "center" });
  }

  const canSend = draft.trim().length > 0 && !loading;
  const canRetry = !loading && messages[messages.length - 1]?.role === "user";
  const askingDisabled = loading;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-5 sm:px-6">
      {messages.length === 0 ? <ProductIntro /> : null}

      <section className="mt-5 rounded-xl border border-line bg-mist px-4 py-3" aria-labelledby="province-label">
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
                  const id = next as JurisdictionId;
                  setJurisdiction(id);
                  setChatJurisdiction(id);
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

      <div id={listId} ref={scrollerRef} aria-live="polite" className={messages.length === 0 ? "" : "mt-8"}>
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
                <article key={`${message.role}-${index}`} className="max-w-none">
                  <p className="mb-2 text-sm font-medium text-accent">{t.siteName}</p>
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
                </article>
              ),
            )}
            {loading ? <Thinking /> : null}
          </div>
        )}
      </div>

      <form
        className="mt-5 border-t border-line bg-white pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        onSubmit={(event) => {
          event.preventDefault();
          sendQuestion(draft);
        }}
      >
        <p className="mb-3 text-[13px] leading-relaxed text-muted">{t.disclaimer}</p>
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
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-navy px-6 text-base font-semibold text-white transition hover:bg-[#16345c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 sm:h-auto sm:min-w-28"
          >
            {t.send}
            <SendIcon />
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">{t.enterHint}</p>
      </form>

      {messages.length === 0 ? (
        <>
          <section className="mt-6" aria-labelledby="examples-heading">
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
                  className="min-h-11 rounded-full border border-line px-4 py-2 text-left text-sm text-navy transition hover:border-accent hover:bg-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8" aria-labelledby="areas-heading">
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
                    className="h-full w-full rounded-lg border border-line px-3 py-3 text-left transition hover:border-accent hover:bg-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
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
  );
}

function ProductIntro() {
  const { t } = useLanguage();
  return (
    <section>
      <p className="text-sm font-medium tracking-wide text-accent">{t.forAnyone}</p>
      <h1 className="mt-2 max-w-xl font-serif text-[2rem] leading-tight tracking-tight text-navy sm:text-4xl">
        {t.homeHeading}
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{t.homeSubtitle}</p>
      <p className="mt-2 max-w-xl text-base leading-relaxed text-ink">{t.audienceLine}</p>
      <div className="mt-5 border-y border-line py-3">
        <h2 className="text-sm font-semibold text-navy">{t.whyTitle}</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-4">
          {t.why.map((item) => (
            <li key={item.title} className="border-t-2 border-navy pt-2">
              <p className="text-sm font-semibold text-navy">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
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
