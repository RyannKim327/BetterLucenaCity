interface Process {
  action: string
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
