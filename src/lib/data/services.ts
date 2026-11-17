import { Service, ServicesCatergory } from "@/types/services";
import { BriefcaseMedical, Certificate, GraduationCap, ScrollText } from "lucide-react";

export const servicesCategory: ServicesCatergory[] = [{
  name: "Medical & Social Care",
  href: "care",
  icon: BriefcaseMedical
}, {
  name: "Certificates & Civil Registration",
  href: "certification",
  icon: Certificate
}, {
  name: "Permits & Businesses",
  href: "permits",
  icon: ScrollText
}, {
  name: "Education & Scholarships",
  href: "education",
  icon: GraduationCap
}]

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
    name: "Business Permit [Change of Information]",
    description:
      "Update business permit details via the Lucena eBPLS portal — change of business address, change of ownership, or other amendments. Requirements vary by change type.",
    office: "Business Permits and Licensing Office",
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
    featured: false,
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
    slug: "yakap-program",
    name: "Philhealth YAKAP Program",
    description: "The YAKAP program (Yaman ng Kalusugan Program or Yamang Kalusugan at Proteksyon) is the Philippine Health Insurance Corporation's (PhilHealth) expanded primary care and preventive healthcare program. Launched as an evolution of the older Konsulta program, YAKAP shifts the healthcare system from treating severe illnesses in hospitals to catching health problems early through regular checkups and community clinics.",
    office: "Lucena City Health",
    featured: true,
    source: "https://www.philhealth.gov.ph/",
    process: [
      {
        name: "Verify or Update Your PhilHealth Membership",
        details: [
          "Ensure you have an active PhilHealth Identification Number (PIN) and an updated Member Data Record (MDR).",
          "If you need to register or update your records, you can visit the PhilHealth Local Health Insurance Office (LHIO) Lucena or coordinate with the City Health Office (CHO) Lucena.",
        ],
      },
      {
        name: "Choose an Accredited YAKAP Clinic",
        details: [
          "Select an accredited Primary Care Provider (PCP) or YAKAP clinic in Lucena City (there are multiple accredited health centers, clinics, and hospitals in the city).",
          "You can register and assign your clinic through the eGovPH Super App, the PhilHealth Member Portal, or by visiting the LHIO Lucena office directly.",
        ],
      },
      {
        name: "Undergo Your First Patient Encounter (FPE)",
        details: [
          "Visit your chosen accredited YAKAP clinic or health center in Lucena City.",
          "Clinic staff will perform a digital liveness check and health assessment (First Patient Encounter).",
          "This entitles you to free primary care checkups, basic laboratory tests, cancer screenings, and prescriptions with a Unique Prescription Security Code (UPSC) if needed.",
        ],
      },
      {
        name: "Claim Free Medicines via GAMOT",
        details: [
          "If prescribed essential medicines (part of the 75 available drugs under the GAMOT package), bring your prescription/UPSC to a GAMOT-accredited pharmacy.",
          "You can avail of up to ₱20,000 annually in free medications.",
        ],
      },
    ]
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
    process: [
      {
        name: "Verify or Update Your PhilHealth Membership",
        timeEstimation: "Within 3–5 business days",
        amount: "Included in assessed fees",
      }
    ]
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
    slug: "brgy-services",
    name: "Barangay Clearance",
    description:
      "An official document issued by your barangay certifying that you are a bona fide resident of good moral character with no pending complaint, blotter record, or case at the barangay level. Commonly required for employment, business and building permits, bank accounts, loans, and school requirements.",
    office: "Barangay Hall (Punong Barangay)",
    source: "https://barangayclearance.ph/",
    process: [
      {
        name: "Prepare Your Documents",
        details: [
          "Bring a valid ID, proof of residency (utility bill, lease contract, or voter registration), a filled-out application form, the clearance fee, and a cedula if your barangay asks for one.",
          "Bring the original and one photocopy of every item. Commonly accepted IDs include the national ID, driver's license, passport, UMID, voter's certification, PRC ID, school ID, and company ID.",
        ],
      },
      {
        name: "Go to Your Barangay Hall",
        details: [
          "Visit the barangay where you actually live, not where you were born. Applying in a barangay where you do not reside is an automatic refusal.",
          "Opening hours are usually 8:00 AM to 5:00 PM, Monday to Friday; some halls open on Saturday mornings.",
        ],
      },
      {
        name: "Get and Fill Out the Application Form",
        details: [
          "Write your full name, complete address, age, civil status, contact number, and purpose.",
          "State the purpose exactly as the receiving office worded it: “For Employment”, “For Business Permit”, and “For Bank Requirement” are not interchangeable.",
        ],
      },
      {
        name: "Submit Your Requirements and Blotter Check",
        details: [
          "Hand over the form, your ID, and documents. Staff check the barangay blotter for any record under your name and address — this is the actual clearance step.",
          "A pending complaint or barangay case will hold the clearance until it is settled through the Lupong Tagapamayapa.",
        ],
      },
      {
        name: "Pay the Fee",
        timeEstimation: "A few minutes",
        amount: "Personal use ₱20–₱100; business use often ₱200–₱1,000+",
        details: [
          "Each barangay sets its own rate under the Local Government Code. First-time job seekers pay nothing under RA 11261, and indigent residents are often free with a certificate of indigency.",
          "Bring exact change and keep the official receipt, as a permit office may ask to see it later.",
        ],
      },
      {
        name: "Wait for Processing and Receive Your Clearance",
        timeEstimation: "Walk-in release usually takes 10–30 minutes",
        details: [
          "Check the spelling of your name, your address, and the purpose, and confirm the dry seal, date, and the barangay captain's signature. Without the dry seal, the clearance is not valid.",
          "Validity runs from 6 months to 1 year in most barangays, though many employers and banks accept only a copy issued within the last 3 months.",
        ],
      },
    ],
  },
  {
    slug: "cedula",
    name: "Cedula (Community Tax Certificate)",
    description:
      "Also called a community tax certificate or residence certificate, the cedula is issued at the barangay hall or city treasurer's office and is required by many barangays when applying for a clearance or certificate.",
    office: "Barangay Hall / City Treasurer's Office",
    source: "https://barangayclearance.ph/",
    process: [
      {
        name: "Confirm If Your Barangay Requires One",
        details: [
          "Many barangays require a cedula, but not every one makes it compulsory for a personal clearance. Ask the desk first to avoid an extra trip.",
        ],
      },
      {
        name: "Prepare Your Details",
        details: [
          "Bring a valid ID and your basic personal details. The rate depends on your declared income, so declare it accurately.",
        ],
      },
      {
        name: "Apply at the Barangay Hall or City Treasurer's Office",
        details: [
          "The cedula is bought in the same hall where you request your clearance, or at the city treasurer's office.",
        ],
      },
      {
        name: "Pay the Fee",
        amount: "Basic rate starts at a few pesos and rises with declared income",
        details: [
          "Most residents pay a small amount. Keep the official receipt for your records.",
        ],
      },
    ],
  },
  {
    slug: "barangay-indigency",
    name: "Barangay Certificate of Indigency",
    description:
      "A barangay certification stating that you or your household have limited income and cannot afford a fee or service. It is accepted by hospitals, DSWD, and legal aid offices for financial aid and fee waivers, and indigent residents often use it to get their barangay clearance for free.",
    office: "Barangay Hall",
    source: "https://barangayclearance.ph/",
    process: [
      {
        name: "Prepare Your Documents",
        details: [
          "Bring a valid ID, proof of address, and documents showing your household's financial situation.",
        ],
      },
      {
        name: "Request the Certificate at the Barangay Hall",
        details: [
          "A certificate of indigency confirms limited income for aid and fee waivers. You apply at the same desk and with the same form used for other barangay certificates.",
          "State the exact purpose so the wording matches what the receiving office expects, such as hospital bill assistance, medicine, or burial aid.",
        ],
      },
      {
        name: "Pay the Fee (if any)",
        amount: "Small fee set by ordinance, often free",
        details: [
          "The fee is usually small, and some barangays issue it free of charge.",
        ],
      },
      {
        name: "Receive and Check the Certificate",
        timeEstimation: "Often issued the same day",
        details: [
          "Confirm the dry seal and signature — offices may reject the document without them.",
          "Most offices accept the certificate within 3 to 6 months. Check with the requesting office, such as the hospital or DSWD, since some require one from the city social welfare office instead.",
        ],
      },
    ],
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
