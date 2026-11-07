import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 30;
const MAX_BUCKETS = 5000;
const LOCK_WAIT_MS = 1500;
const STALE_LOCK_MS = 2000;

type Bucket = {
  count: number;
  resetAt: number;
};

type Store = Record<string, Bucket>;

// One file for every server process that shares this app directory.
// An in-memory Map would reset on each instance. This host has no
// shared counter of its own, so the cap lives in canada-legal-ai/data.
const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "chat-rate-limit.json");
const lockPath = path.join(dataDir, "chat-rate-limit.lock");

function isIpv4(value: string): boolean {
  const parts = value.split(".");
  if (parts.length !== 4) return false;
  return parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}

function isIpv6(value: string): boolean {
  return /^[0-9a-f:]{2,64}$/i.test(value) && value.includes(":");
}

function validIp(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const candidate = value.trim().replace(/^::ffff:/i, "");
  if (isIpv4(candidate) || isIpv6(candidate)) return candidate;
  return undefined;
}

/**
 * Do not use the leftmost X-Forwarded-For value: the caller can set it.
 * Next.js 16 does not expose a client IP on NextRequest (there is no
 * request.ip). If a runtime still sets one, use it. Otherwise use the
 * rightmost valid forwarding entry — the hop a proxy appends, and the
 * socket address when Next copies that address into an empty header —
 * then a socket address on the request, if the runtime provides one.
 */
export function clientKey(request: Request): string {
  const platform = platformClientIp(request);
  if (platform) return platform;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",");
    for (let index = parts.length - 1; index >= 0; index -= 1) {
      const ip = validIp(parts[index]);
      if (ip) return ip;
    }
  }

  const socket = socketAddress(request);
  if (socket) return socket;

  return "unknown";
}

function platformClientIp(request: Request): string | undefined {
  const ip = (request as { ip?: unknown }).ip;
  return typeof ip === "string" ? validIp(ip) : undefined;
}

function socketAddress(request: Request): string | undefined {
  const remote = (request as { socket?: { remoteAddress?: unknown } }).socket?.remoteAddress;
  return typeof remote === "string" ? validIp(remote) : undefined;
}

function bucketKey(key: string): string {
  return createHash("sha256").update(key.slice(0, 64)).digest("hex");
}

function isErrno(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const memoryStore: Store = {};

function allowInMemory(key: string): boolean {
  const now = Date.now();
  const storedKey = bucketKey(key);
  prune(memoryStore, now);
  const current = memoryStore[storedKey];
  if (!current || current.resetAt <= now) {
    memoryStore[storedKey] = { count: 1, resetAt: now + WINDOW_MS };
    return true;
  }
  if (current.count >= MAX_REQUESTS) return false;
  current.count += 1;
  return true;
}

async function withLock<T>(fn: () => Promise<T>): Promise<T | null> {
  await mkdir(dataDir, { recursive: true });
  const started = Date.now();

  for (;;) {
    try {
      await mkdir(lockPath);
      break;
    } catch (error) {
      if (!isErrno(error, "EEXIST")) throw error;
      try {
        const info = await stat(lockPath);
        if (Date.now() - info.mtimeMs > STALE_LOCK_MS) {
          await rm(lockPath, { recursive: true, force: true });
          continue;
        }
      } catch {
        // The lock disappeared between the checks.
      }
      if (Date.now() - started > LOCK_WAIT_MS) return null;
      await delay(20);
    }
  }

  try {
    return await fn();
  } finally {
    await rm(lockPath, { recursive: true, force: true });
  }
}

function readBuckets(value: unknown): Store {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const store: Store = {};
  for (const [key, entry] of Object.entries(value)) {
    if (!entry || typeof entry !== "object") continue;
    const count = (entry as { count?: unknown }).count;
    const resetAt = (entry as { resetAt?: unknown }).resetAt;
    if (typeof count === "number" && Number.isFinite(count) && typeof resetAt === "number") {
      store[key] = { count, resetAt };
    }
  }
  return store;
}

async function readStore(): Promise<Store> {
  try {
    return readBuckets(JSON.parse(await readFile(storePath, "utf8")));
  } catch {
    return {};
  }
}

async function writeStore(store: Store): Promise<void> {
  const temporary = path.join(dataDir, `chat-rate-limit.${process.pid}.tmp`);
  await writeFile(temporary, JSON.stringify(store), "utf8");
  await rename(temporary, storePath);
}

function prune(store: Store, now: number) {
  for (const [key, bucket] of Object.entries(store)) {
    if (bucket.resetAt <= now) delete store[key];
  }
}

export async function allowRequest(key: string): Promise<boolean> {
  const now = Date.now();
  const storedKey = bucketKey(key);
  try {
    const decision = await withLock(async () => {
      const store = await readStore();
      if (Object.keys(store).length > 1000) prune(store, now);

      const current = store[storedKey];
      if (!current || current.resetAt <= now) {
        if (!current && Object.keys(store).length >= MAX_BUCKETS) {
          prune(store, now);
          if (Object.keys(store).length >= MAX_BUCKETS) return false;
        }
        store[storedKey] = { count: 1, resetAt: now + WINDOW_MS };
        await writeStore(store);
        return true;
      }

      if (current.count >= MAX_REQUESTS) return false;

      current.count += 1;
      await writeStore(store);
      return true;
    });

    // A missing lock means the shared counter could not be updated.
    // Refuse the request rather than letting this instance count alone.
    return decision === true;
  } catch {
    // The app directory is not writable on some hosts. An uncaught throw
    // became a generic chat error before Gemini was called. Count in
    // memory so a valid key can still answer.
    return allowInMemory(key);
  }
}
