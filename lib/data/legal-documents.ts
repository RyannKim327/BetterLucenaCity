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

export const legalDisclaimer =
  "City-level entries below are schema samples pending verification against the official records of the Sangguniang Panlungsod of Lucena. National laws listed are verifiable public statutes.";

export const legalDocuments: LegalDocument[] = [
  {
    id: "ra-3271-charter",
    type: "national_law",
    number: "Republic Act No. 3271",
    title: "Charter of the City of Lucena",
    date: "1961-06-17",
    summary:
      "An Act Creating the City of Lucena. Lapsed into law on June 17, 1961; the city was formally inaugurated on August 20, 1961, now celebrated annually as Araw ng Lucena.",
    sourceUrl: "https://lawphil.net/statutes/repacts/ra1961/ra_3271_1961.html",
    sourceName: "LawPhil Project",
    verification: "verified",
  },
  {
    id: "ra-7160-lgc",
    type: "national_law",
    number: "Republic Act No. 7160",
    title: "Local Government Code of 1991",
    date: "1991-10-10",
    summary:
      "The framework law for all LGUs. Lucena was declared a highly urbanized city effective July 1, 1991, gaining administrative independence from the Province of Quezon while remaining part of its legislative district.",
    sourceUrl: "https://lawphil.net/statutes/repacts/ra1991/ra_7160_1991.html",
    sourceName: "LawPhil Project",
    verification: "verified",
  },
  {
    id: "proc-34-2022-araw-ng-lucena",
    type: "national_law",
    number: "Proclamation No. 34, s. 2022",
    title: "Special (Non-Working) Day in the City of Lucena, August 20, 2022",
    date: "2022-08-08",
    summary:
      "Declared August 20, 2022 a special non-working day in Lucena City for the celebration of its 61st Charter Anniversary (Araw ng Lucena), citing the city's creation under RA 3271 dated June 17, 1961.",
    sourceUrl: "https://lawphil.net/executive/proc/proc2022/proc_34_2022.html",
    sourceName: "LawPhil Project",
    verification: "verified",
  },
  {
    id: "sample-co-no-parking",
    type: "city_ordinance",
    number: "[Sample] City Ordinance No. XXXX-20XX",
    title: "Sample: Regulating on-street parking along Quezon Avenue commercial strip",
    date: null,
    summary:
      "Placeholder entry demonstrating the ordinance schema: scope of regulation, penalties, and enforcing office would be described here once sourced from the Sangguniang Panlungsod record.",
    verification: "sample",
  },
  {
    id: "sample-cr-budget-hearing",
    type: "city_resolution",
    number: "[Sample] Resolution No. XXXX-20XX",
    title: "Sample: Convening the committee hearing on the annual city budget",
    date: null,
    summary:
      "Placeholder entry demonstrating the resolution schema: session date, authors, and outcome would be recorded here once sourced from official journal entries.",
    verification: "sample",
  },
  {
    id: "sample-eo-task-force-flood",
    type: "executive_order",
    number: "[Sample] Executive Order No. XXXX-20XX",
    title: "Sample: Constituting the inter-agency flood response task force",
    date: null,
    summary:
      "Placeholder entry demonstrating the executive order schema: composition, mandates, and reporting lines would be detailed here once sourced from the Office of the City Mayor.",
    verification: "sample",
  },
  {
    id: "sample-memo-holiday-schedule",
    type: "memorandum",
    number: "[Sample] Memorandum Circular No. XXXX-20XX",
    title: "Sample: Adjusted work schedule for city hall during charter week",
    date: null,
    summary:
      "Placeholder entry demonstrating the memorandum schema: covered offices and effectivity dates would be specified here once sourced from official memoranda.",
    verification: "sample",
  },
];

export function isLegalDocType(value: string): value is LegalDocType {
  return LEGAL_DOC_TYPES.some((t) => t.id === value);
}
