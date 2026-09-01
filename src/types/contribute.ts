export type ContributeCategory =
  | "Announcement"
  | "Service Information"
  | "Budget / Project"
  | "Transparency Data"
  | "Data Verification / Correction"
  | "Report / Document"
  | "Other";

export interface ContributeFormProps {
  user: { name: string; email: string };
}

export interface ContributePayload {
  category?: string;
  title?: string;
  source?: string;
  supportingDocument?: string;
  details?: string;
  consent?: boolean;
}
