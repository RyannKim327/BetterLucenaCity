// INFO: Announcement
export interface Announcement {
  id: string;
  title: string;
  date: string;
  excerpt: string;
}

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

// INFO: DPWH
export interface DpwhProject {
  contractId: string;
  description: string;
  category: string;
  status: string;
  budget: number;
  amountPaid: number;
  progress: number;
  location: { province: string; region: string };
  contractor: string;
  startDate: string | null;
  completionDate: string | null;
  infraYear: string;
  programName: string;
  sourceOfFunds: string;
  latitude: number | null;
  longitude: number | null;
}

export interface DpwhResponse {
  status: number;
  code: string;
  data: {
    data: DpwhProject[];
    summary: {
      totalProjects: number;
      completed: number;
      ongoing: number;
      notStarted: number;
      forProcurement: number;
      terminated: number;
      totalBudget: number;
    };
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface DpwhQuery {
  search?: string;
  status?: string;
  year?: string;
  limit?: number;
  page?: number;
  scopeAll?: boolean;
}

// INFO: Earthquake
export interface EarthquakeResponse {
  features: Array<{
    date_time: string
    latitude: number
    longitude: number
    depth_km: number
    magnitude: number
    location: string,
    details_link: string
  }>;
}



// INFO: Hotlines
export interface Hotlines {
  name: string
  dial: string[],
  head: boolean
}

// INFO: Legals
export const LEGAL_DOC_TYPES = [
  { id: "national_law", label: "National Law" },
  { id: "city_ordinance", label: "City Ordinance" },
  { id: "city_resolution", label: "City Resolution" },
  { id: "executive_order", label: "Executive Order" },
  { id: "memorandum", label: "Memorandum" },
] as const;

export type LegalDocType = (typeof LEGAL_DOC_TYPES)[number]["id"];

export interface LegalDocument {
  id: string;
  type: LegalDocType;
  number: string;
  title: string;
  date: string | null;
  summary: string;
  sourceUrl?: string;
  sourceName?: string;
  verification: "verified" | "sample";
}


// INFO: Services 
interface Process {
  action: string,
  timeEstimate: string
}

export interface Service {
  slug: string;
  name: string;
  description: string;
  office: string;
  featured?: boolean;
  process: Process[]
}

// INFO: Weather
export interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
  };
}
