export type ContributeCategory =
  | "Announcement"
  | "Service Information"
  | "Budget / Project"
  | "Transparency Data"
  | "Other";

export interface ContributeFormProps {
  user: { name: string; email: string };
}

export interface ContributePayload {
  category?: string;
  title?: string;
  source?: string;
  details?: string;
  consent?: boolean;
}
