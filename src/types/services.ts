export interface Process {
  name: string;
  timeEstimation: string;
  amount: string;
}

export interface Service {
  slug: string;
  name: string;
  description: string;
  office: string;
  featured?: boolean;
  process: Process[];
  source?: string
}
