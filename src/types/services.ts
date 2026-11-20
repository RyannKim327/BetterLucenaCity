import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface ServicesCatergory {
  name: string
  href: string
  description: string
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
  featured?: boolean
}

export interface Process {
  name: string;
  timeEstimation?: string;
  amount?: string;
  details?: string[];
}

export interface Service {
  slug: string;
  name: string;
  description: string;
  office: string;
  category: string;
  process: Process[];
  source?: string
}
