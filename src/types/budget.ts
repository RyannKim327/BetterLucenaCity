// INFO: Budget
export interface GaaYearTotal {
  year: number;
  lineItems: number;
  amount: number;
}

export interface BudgetProgram {
  name: string;
  departmentId: string;
  department: string;
  agencyId: string;
  amount: number;
}

export interface NationalBudgetData {
  source: string;
  attributionUrl: string;
  docsUrl: string;
  query: string;
  latestYear: number;
  currency: "PHP";
  nationalTotals: GaaYearTotal[];
  lucenaMatch: {
    programCount: number;
    totalAmount: number;
    topPrograms: BudgetProgram[];
  };
}

export interface GaaNationalResponse {
  meta: { dataset: string; years: number[]; currency: string; scale: string };
  data: Array<{ year: number; line_items: number; amount: number }>;
}

export interface GaaSearchResponse {
  meta: { dataset: string; years: number[]; query: string; year: number };
  data: Array<{
    department_id: string;
    agency_id: string;
    name: string;
    department: string;
    years: Record<string, { count: number; amount: number }>;
  }>;
}
