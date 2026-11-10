import { NextResponse } from "next/server";

import { jurisdictionById } from "@/lib/jurisdictions";
import { buildSystemPrompt } from "@/lib/prompt";
import { placeName } from "@/lib/ui";
import { allowRequest, clientKey } from "@/lib/rate-limit";
import type { Lang } from "@/lib/language";
import { isTermsConsent, TERMS_ACCEPTANCE_HEADER, TERMS_REQUIRED_ERROR } from "@/lib/terms-consent";
import { parseChatRequest, type ChatMessage } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// gemini-2.5-flash is limited to keys that already used it, and shuts down on
// 2026-12-01. gemini-3.5-flash-lite is the current Flash model with no shutdown
// date. The body is systemInstruction plus contents only.
const MODEL = "gemini-3.5-flash-lite";
const MAX_BODY_BYTES = 256_000;
const GEMINI_ORIGIN = "https://generativelanguage.googleapis.com/v1beta";

type GeminiFailure = {
  ok: false;
  status: number;
  googleStatus: string;
  reason: string;
  message: string;
};

type GeminiSuccess = { ok: true; answer: string; thoughtSignature?: string };

function jsonError(status: number, error: string, extraHeaders?: HeadersInit) {
  const safe =
    error.includes("\n") || /AIza[0-9A-Za-z_-]{8,}/.test(error) || /sk-[A-Za-z0-9]{8,}/.test(error)
      ? "The AI service returned an error that could not be shown."
      : error;

  return NextResponse.json(
    { error: safe },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...extraHeaders,
      },
    },
  );
}

function normalizeApiKey(raw: string): string {
  let value = raw.replace(/^\uFEFF/, "").replace(/[\u200B-\u200D\uFEFF]/g, "");
  value = value.trim().replace(/^(?:export\s+)?(?:GEMINI_API_KEY|GOOGLE_API_KEY)\s*=\s*/i, "").trim();
  for (let i = 0; i < 3; i += 1) {
    const next = value.replace(/^['"`“”‘’]+/, "").replace(/['"`“”‘’]+$/, "").trim();
    if (next === value) break;
    value = next;
  }
  return value.replace(/\s+/g, "");
}

function isHeaderSafe(value: string): boolean {
  if (value.length === 0 || value.length > 500) return false;
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code < 33 || code > 126) return false;
  }
  return true;
}

function loadApiKey(): { state: "missing" } | { state: "unusable" } | { state: "ok"; value: string } {
  const raw = process.env["GEMINI_API_KEY"];
  if (typeof raw !== "string" || raw.trim() === "") return { state: "missing" };
  const value = normalizeApiKey(raw);
  if (!isHeaderSafe(value)) return { state: "unusable" };
  return { state: "ok", value };
}

function redact(text: string, apiKey?: string): string {
  let cleaned = text.replace(/AIza[0-9A-Za-z_-]{8,}/g, "[key]");
  if (apiKey) cleaned = cleaned.split(apiKey).join("[key]");
  return cleaned.slice(0, 300);
}

async function readLimitedBody(request: Request): Promise<
  { ok: true; text: string } | { ok: false; reason: "too-large" | "unreadable" }
> {
  const declared = request.headers.get("content-length");
  if (declared !== null) {
    if (!/^\d+$/.test(declared) || Number(declared) > MAX_BODY_BYTES) {
      return { ok: false, reason: "too-large" };
    }
  }

  if (!request.body) return { ok: true, text: "" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        return { ok: false, reason: "too-large" };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, reason: "unreadable" };
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { ok: true, text: new TextDecoder().decode(body) };
}

function withAnswerLanguage(messages: ChatMessage[], lang: Lang): ChatMessage[] {
  const note =
    lang === "fr"
      ? "Réponds entièrement en français. Tous les titres et toutes les phrases doivent être en français."
      : "Reply entirely in English. Every heading and every sentence must be in English.";
  const lastUser = messages.findLastIndex((message) => message.role === "user");
  if (lastUser < 0) return messages;
  return messages.map((message, index) =>
    index === lastUser ? { ...message, content: `${message.content}\n\n${note}` } : message,
  );
}

function toGeminiContents(messages: ChatMessage[]) {
  const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];

  for (const message of messages) {
    const role = message.role === "assistant" ? "model" : "user";
    const part = { text: message.content };
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts.push(part);
      continue;
    }
    contents.push({ role, parts: [part] });
  }

  while (contents[0]?.role === "model") contents.shift();
  return contents;
}

function readGeminiAnswer(payload: unknown): { text: string; thoughtSignature?: string; blockReason: string } {
  if (!payload || typeof payload !== "object") return { text: "", blockReason: "" };
  const blockReason = readBlockReason(payload);
  const candidates = (payload as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates)) return { text: "", blockReason };

  const first = candidates[0];
  if (!first || typeof first !== "object") return { text: "", blockReason };
  const parts = (first as { content?: { parts?: unknown } }).content?.parts;
  if (!Array.isArray(parts)) return { text: "", blockReason };

  let thoughtSignature: string | undefined;
  const visible: string[] = [];
  const thoughts: string[] = [];
  for (const part of parts) {
    if (!part || typeof part !== "object") continue;
    if (
      "thoughtSignature" in part &&
      typeof part.thoughtSignature === "string" &&
      part.thoughtSignature.length > 0 &&
      part.thoughtSignature.length <= 16_000
    ) {
      thoughtSignature = part.thoughtSignature;
    }
    if (!("text" in part) || typeof part.text !== "string" || part.text.trim() === "") continue;
    if ("thought" in part && part.thought === true) thoughts.push(part.text);
    else visible.push(part.text);
  }

  const text = (visible.length > 0 ? visible : thoughts).join("").trim();
  return {
    text,
    blockReason,
    ...(thoughtSignature ? { thoughtSignature } : {}),
  };
}

function readBlockReason(payload: object): string {
  const feedback = (payload as { promptFeedback?: unknown }).promptFeedback;
  if (!feedback || typeof feedback !== "object" || !("blockReason" in feedback)) return "";
  const reason = feedback.blockReason;
  return typeof reason === "string" && reason !== "" && reason !== "BLOCK_REASON_UNSPECIFIED" ? reason : "";
}

function errorObject(payload: unknown): Record<string, unknown> | undefined {
  const value = Array.isArray(payload) ? payload[0] : payload;
  if (!value || typeof value !== "object" || !("error" in value)) return undefined;
  const error = (value as { error?: unknown }).error;
  if (!error || typeof error !== "object") return undefined;
  return error as Record<string, unknown>;
}

function errorReason(error: Record<string, unknown>): string {
  const details = error.details;
  if (!Array.isArray(details)) return "";
  for (const detail of details) {
    if (!detail || typeof detail !== "object" || !("reason" in detail)) continue;
    if (typeof detail.reason === "string") return detail.reason;
  }
  return "";
}

async function readFailure(response: Response): Promise<GeminiFailure> {
  let googleStatus = "";
  let reason = "";
  let message = "";
  try {
    const error = errorObject((await response.json()) as unknown);
    if (error) {
      if (typeof error.status === "string") googleStatus = error.status;
      if (typeof error.message === "string") message = error.message;
      reason = errorReason(error);
    }
  } catch {
    message = "";
  }

  return { ok: false, status: response.status, googleStatus, reason, message };
}

function isRejectedKey(failure: GeminiFailure): boolean {
  return (
    failure.status === 401 ||
    failure.status === 403 ||
    failure.reason === "API_KEY_INVALID" ||
    failure.message.toLowerCase().includes("api key")
  );
}

function isBusy(failure: GeminiFailure): boolean {
  return failure.status === 429 || failure.googleStatus === "RESOURCE_EXHAUSTED";
}

function geminiHeaders(apiKey: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-goog-api-key": apiKey,
  };
}

function failureFromThrow(error: unknown): GeminiFailure {
  const message = error instanceof Error ? error.message : "";
  const lower = message.toLowerCase();
  const reason =
    lower.includes("bytestring") || lower.includes("invalid header") || lower.includes("invalid character")
      ? "KEY_NOT_SENDABLE"
      : lower.includes("timeout") || lower.includes("aborted")
        ? "TIMEOUT"
        : lower.includes("fetch") ||
            lower.includes("network") ||
            lower.includes("terminated") ||
            lower.includes("socket") ||
            lower.includes("econnreset") ||
            lower.includes("enotfound") ||
            lower.includes("econnrefused")
          ? "NETWORK"
          : "LOCAL";
  return { ok: false, status: 0, googleStatus: "", reason, message: "" };
}

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  messages: ChatMessage[],
): Promise<GeminiSuccess | GeminiFailure> {
  let response: Response;
  try {
    response = await fetch(`${GEMINI_ORIGIN}/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: geminiHeaders(apiKey),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: toGeminiContents(messages),
      }),
      signal: AbortSignal.timeout(55_000),
    });
  } catch (error) {
    console.error(
      `Gemini ${MODEL} was not sent: ${redact(error instanceof Error ? error.message : "unknown", apiKey)}`,
    );
    return failureFromThrow(error);
  }

  if (!response.ok) {
    const failure = await readFailure(response);
    console.error(
      `Gemini ${MODEL} failed: ${failure.status} ${failure.googleStatus} ${failure.reason} ${redact(failure.message, apiKey)}`,
    );
    return failure;
  }

  let payload: unknown;
  try {
    payload = (await response.json()) as unknown;
  } catch {
    return { ok: false, status: response.status, googleStatus: "", reason: "", message: "Response was not JSON." };
  }

  try {
    const answer = readGeminiAnswer(payload);
    if (!answer.text && answer.blockReason) {
      return {
        ok: false,
        status: response.status,
        googleStatus: "BLOCKED",
        reason: answer.blockReason,
        message: "",
      };
    }
    return {
      ok: true,
      answer: answer.text.slice(0, 12000),
      ...(answer.thoughtSignature ? { thoughtSignature: answer.thoughtSignature } : {}),
    };
  } catch (error) {
    console.error(
      `Gemini ${MODEL} answer could not be read: ${redact(error instanceof Error ? error.message : "unknown", apiKey)}`,
    );
    return { ok: false, status: response.status, googleStatus: "", reason: "", message: "" };
  }
}


function safeToken(value: string): string {
  return /^[A-Za-z0-9_-]{1,40}$/.test(value) ? value : "";
}

function failureResponse(failure: GeminiFailure) {
  if (failure.reason === "KEY_NOT_SENDABLE") {
    return jsonError(502, "The saved API key could not be sent. Check GEMINI_API_KEY.");
  }

  if (isRejectedKey(failure)) {
    return jsonError(
      502,
      "The AI service rejected the server API key. Check GEMINI_API_KEY.",
    );
  }

  if (isBusy(failure)) {
    return jsonError(
      429,
      "The AI service is busy right now. Please wait a moment and try again.",
      { "Retry-After": "20" },
    );
  }

  if (failure.status === 404) {
    return jsonError(
      502,
      "The AI model is not available for this key right now. Please try again later.",
    );
  }

  if (failure.googleStatus === "BLOCKED") {
    return jsonError(502, "The AI service declined to answer this question.");
  }

  if (failure.reason === "TIMEOUT") {
    return jsonError(504, "The AI service timed out before it could answer.");
  }

  if (failure.reason === "NETWORK") {
    return jsonError(502, "The AI service could not be reached.");
  }

  if (failure.status < 400 || failure.status > 599) {
    return jsonError(502, "The AI request failed before Google returned a status.");
  }

  const detail = [safeToken(failure.googleStatus), safeToken(failure.reason)].filter(Boolean).join(" ");
  return jsonError(
    502,
    detail
      ? `Google returned HTTP ${failure.status} ${detail}.`
      : `Google returned HTTP ${failure.status}.`,
  );
}

export async function POST(request: Request) {

  if (!(await allowRequest(clientKey(request)))) {
    return jsonError(
      429,
      "Too many questions from this network. Please wait a few minutes and try again.",
      { "Retry-After": "60" },
    );
  }

  const acceptance = request.headers.get(TERMS_ACCEPTANCE_HEADER);
  if (!isTermsConsent(acceptance)) {
    return jsonError(403, TERMS_REQUIRED_ERROR);
  }

  const contentType = request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  if (contentType !== "application/json") {
    return jsonError(415, "That question could not be read. Please try again.");
  }

  const limited = await readLimitedBody(request);
  if (!limited.ok) {
    return jsonError(
      limited.reason === "too-large" ? 413 : 400,
      limited.reason === "too-large"
        ? "This conversation is too long. Start a new chat to continue."
        : "That question could not be read. Please try again.",
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(limited.text) as unknown;
  } catch {
    return jsonError(400, "That question could not be read. Please try again.");
  }

  const parsed = parseChatRequest(body);
  if (!parsed.ok) return jsonError(400, parsed.error);

  const loaded = loadApiKey();
  if (loaded.state === "missing") {
    return jsonError(
      503,
      "The AI service is not configured yet. Add GEMINI_API_KEY on the server and try again.",
    );
  }
  if (loaded.state === "unusable") {
    console.error("Gemini request was not sent: GEMINI_API_KEY is not a valid header value.");
    return jsonError(502, "The saved API key could not be sent. Check GEMINI_API_KEY.");
  }
  const apiKey = loaded.value;

  const jurisdiction = jurisdictionById(parsed.value.jurisdiction);

  try {
    const result = await callGemini(
      apiKey,
      buildSystemPrompt(placeName(jurisdiction.id, parsed.value.lang), parsed.value.lang === "fr"),
      withAnswerLanguage(parsed.value.messages, parsed.value.lang),
    );

    if (!result.ok) return failureResponse(result);

    if (!result.answer) {
      return jsonError(
        502,
        "The AI service returned an empty answer. Please try again.",
      );
    }

    return NextResponse.json(
      {
        answer: result.answer,
        ...(result.thoughtSignature ? { thoughtSignature: result.thoughtSignature } : {}),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error(`Gemini request failed: ${redact(error instanceof Error ? error.message : "unknown", apiKey)}`);
    return failureResponse(failureFromThrow(error));
  }
}
