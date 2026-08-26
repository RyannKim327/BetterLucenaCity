import { GaaNationalResponse, GaaSearchResponse, NationalBudgetData } from "@/types/sources";
import { LUCENA, fetchJson } from "./shared";

const BASE_URL = "https://budget.bettergov.ph/api/v1";
const DATE = new Date()
const LATEST_YEAR = DATE.getFullYear();
const REVALIDATE_SECONDS = 3600;

export async function getNationalBudget(): Promise<NationalBudgetData> {
  const query = LUCENA.name;

  const [totals, search] = await Promise.all([
    fetchJson<GaaNationalResponse>(`${BASE_URL}/gaa`, REVALIDATE_SECONDS),
    fetchJson<GaaSearchResponse>(
      `${BASE_URL}/gaa/search?q=${encodeURIComponent(query)}&year=${LATEST_YEAR}&limit=100`,
      REVALIDATE_SECONDS
    ),

  ]);

  const matched = search.data
    .map((row) => ({
      name: row.name,
      departmentId: row.department_id,
      department: row.department,
      agencyId: row.agency_id,
      amount: row.years[String(LATEST_YEAR)]?.amount ?? 0,
    }))
    .filter((row) => row.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return {
    source: "BetterGov.ph PH Budget Data API",
    attributionUrl: "https://budget.bettergov.ph/gaa",
    docsUrl: "https://budget.bettergov.ph/docs",
    query,
    latestYear: LATEST_YEAR,
    currency: "PHP",
    nationalTotals: totals.data.map((row) => ({
      year: row.year,
      lineItems: row.line_items,
      amount: row.amount,
    })),
    lucenaMatch: {
      programCount: matched.length,
      totalAmount: matched.reduce((sum, row) => sum + row.amount, 0),
      topPrograms: matched.slice(0, 5),
    },
  };
}
