import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface ServicesCategory {
  name: string
  href: string
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}

export type ServicesCatergory = ServicesCategory;

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
