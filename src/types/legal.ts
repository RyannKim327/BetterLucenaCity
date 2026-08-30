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
  /** Derived: only "verified" once a user has approved the document. */
  verification?: boolean;
}

export interface LegalType {
  id: string;
  label: string;
}

export interface DocumentsResponse {
  locality: string;
  disclaimer: string;
  total: number;
  totalByType: Record<string, number>;
  types: LegalType[];
  documents: LegalDocument[];
}
