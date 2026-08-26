import { DpwhQuery, DpwhResponse } from "@/types/sources";
import { LUCENA, fetchJson } from "./shared";

export async function getDpwhProjects(query: DpwhQuery = {}) {
  const params = new URLSearchParams();
  if (!query.scopeAll) {
    params.set("region", LUCENA.region);
    params.set("province", LUCENA.province);
  }
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.year) params.set("infra_year", query.year);
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(Math.min(query.limit ?? 10, 50)));

  const url = `https://api.dpwh.bettergov.ph/projects?${params.toString()}`;
  const json = await fetchJson<DpwhResponse>(url, 900);

  return {
    source: "DPWH Infrastructure Transparency Portal",
    attributionUrl: "https://transparency.dpwh.gov.ph/",
    scope: query.scopeAll ? "national" : `${LUCENA.province} province`,
    projects: json.data.data.map((p) => ({
      ...p,
      isLocal:
        p.location.province.toLowerCase().includes(LUCENA.province.toLowerCase()) &&
        p.description.toLowerCase().includes(LUCENA.name.split(" ")[0].toLowerCase()),
    })),
    summary: json.data.summary,
    pagination: json.data.pagination,
  };
}
