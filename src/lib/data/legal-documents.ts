import { LEGAL_DOC_TYPES, LegalDocType, LegalDocument } from "@/types/legal";


export const legalDisclaimer =
  "City-level entries below are compiled from official public records and published session reports of the Sangguniang Panlungsod of Lucena. National laws listed are verifiable public statutes.";

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
  },
  {
    id: "ord-2915-traffic-rerouting",
    type: "city_ordinance",
    number: "City Ordinance No. 2915",
    title: "An Ordinance Authorizing the City Mayor to Promulgate and Execute on an Experimental Basis a Traffic Rerouting Scheme in Lucena City",
    date: "2026-01-15",
    summary:
      "Approved on third and final reading by the 20th Sangguniang Panlungsod, this ordinance institutes a three-month experimental traffic rerouting scheme effective February 2, 2026. It designates one-way routes and looped patterns for tricycles and public utility jeepneys through inner streets (e.g., Enriquez, Ravanzo, Granja, Del Pilar, Gomez, Merchan, Barcelona, Recto) and prescribes graduated penalties — written warning (first offense), community service plus ₱200 (second), and community service plus ₱400 (third and succeeding) — for ignoring one-way signs, counterflowing, and illegal parking.",
    sourceUrl: "https://www.sentineltimes.net/2026/01/lucena-city-oks-ordinance-for.html",
    sourceName: "Sentinel Times Quezon",
  },
  {
    id: "ord-lucena-animal-code",
    type: "city_ordinance",
    number: "Legislative Proposal No. 20-02-274",
    title: "Lucena City Animal Code",
    date: null,
    summary:
      "A proposed ordinance establishing the Lucena City Animal Code, designed to promote animal welfare, responsible pet ownership, and care for animals in the city. The proposal was the subject of a public hearing by the Committee on Laws, Rules and Human Rights on May 14, 2026, in coordination with the City Veterinarian's Office, the Bureau of Animal Industry, and pet shop owners.",
    sourceUrl: "https://www.govserv.org/PH/Lucena/102387802658046/Sangguniang-Panlungsod---Lucena-City",
    sourceName: "Sangguniang Panlungsod - Lucena City",
  },
  {
    id: "res-phivolcs-gps-moa",
    type: "city_resolution",
    number: "Legislative Proposal No. 20-05-348",
    title: "A Resolution Authorizing the City Mayor to Enter Into a Memorandum of Agreement with PHIVOLCS for a Continuous GPS Receiver",
    date: null,
    summary:
      "A city resolution authorizing the City Mayor, on behalf of the City Government of Lucena, to enter into a Memorandum of Agreement with the Philippine Institute of Volcanology and Seismology (PHIVOLCS) for the installation and maintenance of a continuous Global Positioning System (GPS) receiver. The device supports measurement and monitoring of ground movement within a 50-kilometer radius, strengthening the city's earthquake and geologic-hazard preparedness.",
    sourceUrl: "https://www.govserv.org/PH/Lucena/102387802658046/Sangguniang-Panlungsod---Lucena-City",
    sourceName: "Sangguniang Panlungsod - Lucena City",
  },
  {
    id: "res-meralco-right-of-way",
    type: "city_resolution",
    number: "Legislative Proposals No. 20-05-352 & 20-05-353",
    title: "Resolutions Authorizing Grant of Right of Way to Meralco over City Properties",
    date: null,
    summary:
      "Resolutions authorizing the City Mayor, on behalf of the City Government of Lucena, to enter into a Grant of Right of Way with Meralco over portions of city-owned property located at Barangay Marketview, and under Meralco Project No. X26041057221 — supporting power infrastructure serving the city.",
    sourceUrl: "https://www.govserv.org/PH/Lucena/102387802658046/Sangguniang-Panlungsod---Lucena-City",
    sourceName: "Sangguniang Panlungsod - Lucena City",
  },
];

export function isLegalDocType(value: string): value is LegalDocType {
  return LEGAL_DOC_TYPES.some((t) => t.id === value);
}
