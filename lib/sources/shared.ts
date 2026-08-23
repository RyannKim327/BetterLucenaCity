export const LUCENA = {
  name: "Lucena City",
  latitude: 13.9333,
  longitude: 121.6167,
  province: "Quezon",
  region: "Region IV-A",
} as const;

export async function fetchJson<T>(
  url: string,
  revalidate = 300
): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new Error(`Upstream request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
