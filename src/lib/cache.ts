type Fetcher<T> = () => Promise<T>;

interface CacheEntry<T> {
  value: T;
  storedAt: number;
  expiresAt: number;
}

const MAX_ENTRIES = 250;
const DEFAULT_MAX_STALE_SECONDS = 86_400;

const store = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

function evict() {
  if (store.size <= MAX_ENTRIES) return;
  const now = Date.now();
  for (const [key, entry] of store) {
    if (store.size <= MAX_ENTRIES) break;
    if (entry.expiresAt <= now) store.delete(key);
  }
  for (const key of store.keys()) {
    if (store.size <= MAX_ENTRIES) break;
    store.delete(key);
  }
}

async function refresh<T>(
  key: string,
  ttlSeconds: number,
  fetcher: Fetcher<T>
): Promise<T> {
  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;

  const task = (async () => {
    const value = await fetcher();
    store.set(key, { value, storedAt: Date.now(), expiresAt: Date.now() + ttlSeconds * 1_000 });
    evict();
    return value;
  })();

  inflight.set(key, task);
  try {
    return await task;
  } finally {
    inflight.delete(key);
  }
}

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: Fetcher<T>,
  maxStaleSeconds: number = DEFAULT_MAX_STALE_SECONDS
): Promise<T> {
  const entry = store.get(key);
  const now = Date.now();

  if (entry && entry.expiresAt > now) {
    return entry.value as T;
  }

  if (entry && now - entry.storedAt < maxStaleSeconds * 1_000) {
    void refresh(key, ttlSeconds, fetcher).catch(() => undefined);
    return entry.value as T;
  }

  return refresh(key, ttlSeconds, fetcher);
}
