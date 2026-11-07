import { isJurisdictionId, type JurisdictionId } from "@/lib/jurisdictions";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
  thoughtSignature?: string;
};

export type ChatRequest = {
  jurisdiction: JurisdictionId;
  messages: ChatMessage[];
};

const MAX_MESSAGES = 20;
const MAX_USER_CHARS = 4000;
const MAX_ASSISTANT_CHARS = 12000;
const BODY_KEYS = new Set(["jurisdiction", "messages"]);
const MESSAGE_KEYS = new Set(["role", "content", "thoughtSignature"]);
const MAX_SIGNATURE_CHARS = 16_000;

const UNREADABLE = "That question could not be read. Please try again.";

export function parseChatRequest(
  input: unknown,
): { ok: true; value: ChatRequest } | { ok: false; error: string } {
  if (!isPlainObject(input) || !hasOnlyKeys(input, BODY_KEYS)) {
    return { ok: false, error: UNREADABLE };
  }

  const jurisdiction = input.jurisdiction;
  if (typeof jurisdiction !== "string" || !isJurisdictionId(jurisdiction)) {
    return {
      ok: false,
      error: "Choose a province, territory, or Federal / Canada-wide.",
    };
  }

  const parsed = parseMessages(input.messages, { requireUserEnding: true });
  if (!parsed.ok) return parsed;

  return { ok: true, value: { jurisdiction, messages: parsed.messages } };
}

function isPlainObject(input: unknown): input is Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return false;
  const prototype = Object.getPrototypeOf(input);
  return prototype === Object.prototype || prototype === null;
}

function hasOnlyKeys(input: Record<string, unknown>, allowed: Set<string>): boolean {
  const keys = Object.keys(input);
  return keys.length <= allowed.size && keys.every((key) => allowed.has(key));
}

function parseMessages(
  input: unknown,
  options: { requireUserEnding: boolean },
): { ok: true; messages: ChatMessage[] } | { ok: false; error: string } {
  if (!Array.isArray(input)) {
    return { ok: false, error: "Type a question to continue." };
  }

  if (options.requireUserEnding && input.length === 0) {
    return { ok: false, error: "Type a question to continue." };
  }

  if (input.length > MAX_MESSAGES) {
    return {
      ok: false,
      error: "This conversation is too long. Start a new chat to continue.",
    };
  }

  const messages: ChatMessage[] = [];

  for (const item of input) {
    if (!isPlainObject(item) || !hasOnlyKeys(item, MESSAGE_KEYS)) {
      return { ok: false, error: "That message could not be read." };
    }

    const role = item.role;
    const content = item.content;

    if (role !== "user" && role !== "assistant") {
      return { ok: false, error: "That message could not be read." };
    }

    if (typeof content !== "string") {
      return { ok: false, error: "That message could not be read." };
    }

    const trimmed = content.trim();
    const max = role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS;

    if (trimmed.length === 0) {
      return { ok: false, error: "Type a question to continue." };
    }

    if (trimmed.length > max) {
      return {
        ok: false,
        error: "That message is too long. Try a shorter question.",
      };
    }

    const signature = item.thoughtSignature;
    if (signature !== undefined && typeof signature !== "string") {
      return { ok: false, error: "That message could not be read." };
    }
    if (typeof signature === "string" && signature.length > MAX_SIGNATURE_CHARS) {
      return {
        ok: false,
        error: "That message is too long. Try a shorter question.",
      };
    }

    messages.push({
      role,
      content: trimmed,
      ...(role === "assistant" && typeof signature === "string" && signature.length > 0
        ? { thoughtSignature: signature }
        : {}),
    });
  }

  const last = messages[messages.length - 1];
  if (options.requireUserEnding && (!last || last.role !== "user")) {
    return { ok: false, error: "Type a question to continue." };
  }

  return { ok: true, messages };
}
