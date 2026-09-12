import { Service } from "@/types/services";

export const services: Service[] = [
  {
    slug: "business-permits",
    name: "Business Permits & Licensing",
    description:
      "Apply for or renew business permits, secure mayor's permits, and check licensing requirements.",
    office: "Business Permits and Licensing Office",
    featured: true,
    source: "https://client.ebpls-lucenacity.com/#new-application",
    process: [
      {
        name: "Prepare Required Documents",
        timeEstimation: "Not specified",
        amount: "Not specified",
      },
      {
        name: "Fill Out Business Permit Application Form",
        timeEstimation: "Not specified",
        amount: "Not specified",
      },
      {
        name: "Upload the Requirements",
        timeEstimation: "Not specified",
        amount: "Not specified",
      },
      {
        name: "Inspection & Approval",
        timeEstimation: "Not specified",
        amount: "Not specified",
      },
      {
        name: "Assessment and Payment",
        timeEstimation: "Not specified",
        amount: "Based on Statement of Account",
      },
      {
        name: "Release of Business Permit",
        timeEstimation: "Within the overall 3–5 business day processing period",
        amount: "Included in assessed fees",
      },
    ]
  },
  {
    slug: "business-permit-renewal",
    name: "Business Permit Renewal",
    description:
      "Renew an existing business permit via the Lucena eBPLS portal — annual renewal for established businesses, with online payment via GCash or Landbank (0211-3057-54, City Government of Lucena).",
    office: "Business Permits and Licensing Office",
    featured: true,
    source: "https://client.ebpls-lucenacity.com/#renew-application",
    process: [
      {
        name: "Prepare Required Documents",
        timeEstimation: "Not specified",
        amount: "Not specified",
      },
      {
        name: "Fill Out Renewal Application Form (login with BPLO credentials)",
        timeEstimation: "Not specified",
        amount: "Not specified",
      },
      {
        name: "Upload the Requirements (single PDF)",
        timeEstimation: "Not specified",
        amount: "Not specified",
      },
      {
        name: "Inspection & Approval (if required)",
        timeEstimation: "Not specified",
        amount: "Not specified",
      },
      {
        name: "Assessment and Payment",
        timeEstimation: "Not specified",
        amount: "Based on Statement of Account",
      },
      {
        name: "Release of Business Permit",
        timeEstimation: "Within 3–5 business days",
        amount: "Included in assessed fees",
      },
    ]
  },
  {
    slug: "business-permit-change-information",
    name: "Business Permit — Change of Information",
    description:
      "Update business permit details via the Lucena eBPLS portal — change of business address, change of ownership, or other amendments. Requirements vary by change type.",
    office: "Business Permits and Licensing Office",
    featured: false,
    source: "https://client.ebpls-lucenacity.com/#change-information",
    process: [
      {
        name: "Prepare Required Documents (varies by change type)",
        timeEstimation: "Not specified",
        amount: "Not specified",
      },
      {
        name: "Fill Out Business Permit Application Form",
        timeEstimation: "Not specified",
        amount: "Not specified",
      },
      {
        name: "Upload the Requirements (single PDF)",
        timeEstimation: "Not specified",
        amount: "Not specified",
      },
      {
        name: "Inspection & Approval (if required)",
        timeEstimation: "Not specified",
        amount: "Not specified",
      },
      {
        name: "Assessment and Payment",
        timeEstimation: "Not specified",
        amount: "Based on Statement of Account",
      },
      {
        name: "Release of Updated Business Permit",
        timeEstimation: "Within 3–5 business days",
        amount: "Included in assessed fees",
      },
    ]
  },
  {
    slug: "civil-registry",
    name: "Civil Registry",
    description:
      "Request copies of birth, marriage, and death certificates, and file late registrations.",
    office: "Office of the City Civil Registrar",
    featured: true,
    process: []
  },
  {
    slug: "real-property-tax",
    name: "Real Property Tax",
    description:
      "Assess and pay real property tax, request tax clearances, and update property records.",
    office: "City Assessor & City Treasury",
    featured: true,
    process: []
  },
  {
    slug: "health-services",
    name: "Health Services",
    description:
      "Access consultations, immunization, maternal care, and medical assistance programs.",
    office: "City Health Office",
    featured: true,
    process: []
  },
  {
    slug: "social-services",
    name: "Social Welfare Services",
    description:
      "Social assistance, senior citizen and PWD IDs, and support for indigent residents.",
    office: "City Social Welfare and Development Office",
    featured: true,
    process: []
  },
  {
    slug: "building-permits",
    name: "Building & Construction Permits",
    description:
      "Secure building permits, occupancy permits, and coordinate inspections.",
    office: "Office of the City Building Official",
    featured: true,
    process: []
  },
  {
    slug: "employment",
    name: "Employment Assistance",
    description:
      "Job matching, local employment facilitation, and special program for employment of students.",
    office: "Public Employment Service Office (PESO)",
    process: []
  },
  {
    slug: "scholarship",
    name: "Scholarship Programs",
    description:
      "City-funded scholarships for qualified students of Lucena City.",
    office: "City Scholarship Office",
    process: []
  },
];
