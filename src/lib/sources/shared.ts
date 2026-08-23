import axios from "axios";
import { cached } from "@/lib/cache";

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
  return cached(`upstream-json:${url}`, revalidate, () =>
    axios
      .get<T>(url, {
        headers: { Accept: "application/json" },
        timeout: 15_000,
      })
      .then((res) => res.data)
  );
}
