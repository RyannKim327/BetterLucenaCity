export interface Process {
  /** Step/process name — e.g., "Submit application form" */
  name: string;
  /** Estimated duration — e.g., "15 mins", "3 working days" */
  timeEstimation: string;
  /** Fee — "Free" or formatted amount like "₱500", "₱200 - ₱400" */
  amount: string;
}

export interface Service {
  slug: string;
  name: string;
  description: string;
  office: string;
  featured?: boolean;
  /** Ordered steps for the service — [] means no detailed process yet */
  process: Process[];
}
