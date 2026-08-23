export interface Service {
  slug: string;
  name: string;
  description: string;
  office: string;
  featured?: boolean;
}

export const services: Service[] = [
  {
    slug: "business-permits",
    name: "Business Permits & Licensing",
    description:
      "Apply for or renew business permits, secure mayor's permits, and check licensing requirements.",
    office: "Business Permits and Licensing Office",
    featured: true,
  },
  {
    slug: "civil-registry",
    name: "Civil Registry",
    description:
      "Request copies of birth, marriage, and death certificates, and file late registrations.",
    office: "Office of the City Civil Registrar",
    featured: true,
  },
  {
    slug: "real-property-tax",
    name: "Real Property Tax",
    description:
      "Assess and pay real property tax, request tax clearances, and update property records.",
    office: "City Assessor & City Treasury",
    featured: true,
  },
  {
    slug: "health-services",
    name: "Health Services",
    description:
      "Access consultations, immunization, maternal care, and medical assistance programs.",
    office: "City Health Office",
    featured: true,
  },
  {
    slug: "social-services",
    name: "Social Welfare Services",
    description:
      "Social assistance, senior citizen and PWD IDs, and support for indigent residents.",
    office: "City Social Welfare and Development Office",
    featured: true,
  },
  {
    slug: "building-permits",
    name: "Building & Construction Permits",
    description:
      "Secure building permits, occupancy permits, and coordinate inspections.",
    office: "Office of the City Building Official",
    featured: true,
  },
  {
    slug: "employment",
    name: "Employment Assistance",
    description:
      "Job matching, local employment facilitation, and special program for employment of students.",
    office: "Public Employment Service Office (PESO)",
  },
  {
    slug: "scholarship",
    name: "Scholarship Programs",
    description:
      "City-funded scholarships for qualified students of Lucena City.",
    office: "City Scholarship Office",
  },
];
