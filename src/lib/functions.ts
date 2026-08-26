export function formatPeso(n: number) {
  return n >= 1_000_000_000
    ? `₱${(n / 1_000_000_000).toFixed(1)}B`
    : n >= 1_000_000
      ? `₱${(n / 1_000_000).toFixed(1)}M`
      : `₱${n.toLocaleString()}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
