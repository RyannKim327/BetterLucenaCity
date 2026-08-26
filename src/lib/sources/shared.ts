import axios from "axios";
import { cached } from "@/lib/cache";

export const LUCENA = {
  name: "Lucena City",
  latitude: 13.9333,
  longitude: 121.6167,
  province: "Quezon",
  region: "Region IV-A",
  barangays: [
    "Brgy. 1", "Brgy. 2", "Brgy. 3",
    "Brgy. 4", "Brgy. 5", "Brgy. 6",
    "Brgy. 7", "Brgy. 8", "Brgy. 9",
    "Brgy. 10", "Brgy. 11",
    "Barra", "Bocohan", "Cotta",
    "Gulang-Gulang", "Dalahican", "Domoit",
    "Ibabang Dupay", "Ibabang Iyam", "Ibabang Talim",
    "Ilayang Dupay", "Ilayang Iyam", "Ilayang Talim",
    "Isabang", "Marketview", "Mayao Castillo",
    "Mayao Crossing", "Mayao Kanluran", "Mayao Parada",
    "Mayao Silangan", "Ransohan", "Salinas",
    "Talao-Talao"
  ],
  area: "83.59 km²",
  populationDensity: "3,354/km²",
  annualPopulationChange: "0.12%",
  population: {
    male: 139_143,
    female: 139_204
  },
  ageGroup: {
    "0-14": 87_451,
    "15-64": 177_173,
    "65+": 13_723
  },

} as const;

export function internalApiUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

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
