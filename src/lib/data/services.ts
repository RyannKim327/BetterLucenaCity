import { Service, ServicesCatergory } from "@/types/services";
import { BriefcaseBusiness, Certificate, GraduationCap, HeartPulse, Landmark } from "lucide-react";

export const servicesCategory: ServicesCatergory[] = [{
  name: "Business & Permits",
  href: "business",
  description: "Business permits, renewals, amendments, construction, and property tax.",
  icon: BriefcaseBusiness
}, {
  name: "Barangay",
  href: "barangay",
  description: "Barangay clearance, cedula, and certificate of indigency.",
  icon: Landmark,
  featured: true
}, {
  name: "Health & Social Services",
  href: "health",
  description: "City health, barangay health centers, PhilHealth, and social welfare programs.",
  icon: HeartPulse,
  featured: true
}, {
  name: "Civil Registration",
  href: "civil-registration",
  description: "Birth, marriage, and death certificates from the City Civil Registrar.",
  icon: Certificate,
  featured: true
}, {
  name: "Education & Employment",
  href: "education",
  description: "Scholarships, job matching, and employment assistance.",
  icon: GraduationCap
}]

export const services: Service[] = [
  {
    slug: "business-permits",
    name: "Business Permits & Licensing",
    description:
      "Mag-apply o magre-renew ng business permit, kumuha ng mayor's permit, at suriin ang mga licensing requirements.",
    office: "Business Permits and Licensing Office",
    category: "business",
    source: "https://client.ebpls-lucenacity.com/#new-application",
    process: [
      {
        name: "Ihanda ang mga Kinakailangang Dokumento",
        timeEstimation: "Hindi tinukoy",
        amount: "Hindi tinukoy",
      },
      {
        name: "Punan ang Form ng Aplikasyon para sa Business Permit",
        timeEstimation: "Hindi tinukoy",
        amount: "Hindi tinukoy",
      },
      {
        name: "I-upload ang mga Kinakailangan",
        timeEstimation: "Hindi tinukoy",
        amount: "Hindi tinukoy",
      },
      {
        name: "Inspeksyon at Pag-apruba",
        timeEstimation: "Hindi tinukoy",
        amount: "Hindi tinukoy",
      },
      {
        name: "Pagtataya at Pagbabayad",
        timeEstimation: "Hindi tinukoy",
        amount: "Batay sa Statement of Account",
      },
      {
        name: "Pag-isyu ng Business Permit",
        timeEstimation: "Sa loob ng pangkalahatang 3–5 araw ng trabaho para sa pagproseso",
        amount: "Kasama sa mga nakatakdang bayaran",
      },
    ]
  },
  {
    slug: "business-permit-renewal",
    name: "Business Permit Renewal",
    description:
      "I-renew ang existing business permit sa pamamagitan ng Lucena eBPLS portal — taunang renewal para sa mga established business, may online payment via GCash o Landbank (0211-3057-54, City Government of Lucena).",
    office: "Business Permits and Licensing Office",
    category: "business",
    source: "https://client.ebpls-lucenacity.com/#renew-application",
    process: [
      {
        name: "Ihanda ang mga Kinakailangang Dokumento",
        timeEstimation: "Hindi tinukoy",
        amount: "Hindi tinukoy",
      },
      {
        name: "Punan ang Form ng Pagre-renew (mag-login gamit ang BPLO credentials)",
        timeEstimation: "Hindi tinukoy",
        amount: "Hindi tinukoy",
      },
      {
        name: "I-upload ang mga Kinakailangan (isang PDF)",
        timeEstimation: "Hindi tinukoy",
        amount: "Hindi tinukoy",
      },
      {
        name: "Inspeksyon at Pag-apruba (kung kinakailangan)",
        timeEstimation: "Hindi tinukoy",
        amount: "Hindi tinukoy",
      },
      {
        name: "Pagtataya at Pagbabayad",
        timeEstimation: "Hindi tinukoy",
        amount: "Batay sa Statement of Account",
      },
      {
        name: "Pag-isyu ng Business Permit",
        timeEstimation: "Sa loob ng 3–5 araw ng trabaho",
        amount: "Kasama sa mga nakatakdang bayaran",
      },
    ]
  },
  {
    slug: "business-permit-change-information",
    name: "Business Permit [Change of Information]",
    description:
      "I-update ang details ng business permit sa Lucena eBPLS portal — pagbabago ng business address, pagbabago ng ownership, o iba pang amendment. Nag-iiba ang requirements ayon sa uri ng pagbabago.",
    office: "Business Permits and Licensing Office",
    category: "business",
    source: "https://client.ebpls-lucenacity.com/#change-information",
    process: [
      {
        name: "Ihanda ang mga Kinakailangang Dokumento (nababago ayon sa uri ng pagbabago)",
        timeEstimation: "Hindi tinukoy",
        amount: "Hindi tinukoy",
      },
      {
        name: "Punan ang Form ng Aplikasyon para sa Business Permit",
        timeEstimation: "Hindi tinukoy",
        amount: "Hindi tinukoy",
      },
      {
        name: "I-upload ang mga Kinakailangan (isang PDF)",
        timeEstimation: "Hindi tinukoy",
        amount: "Hindi tinukoy",
      },
      {
        name: "Inspeksyon at Pag-apruba (kung kinakailangan)",
        timeEstimation: "Hindi tinukoy",
        amount: "Hindi tinukoy",
      },
      {
        name: "Pagtataya at Pagbabayad",
        timeEstimation: "Hindi tinukoy",
        amount: "Batay sa Statement of Account",
      },
      {
        name: "Pag-isyu ng Na-update na Business Permit",
        timeEstimation: "Sa loob ng 3–5 araw ng trabaho",
        amount: "Kasama sa mga nakatakdang bayaran",
      },
    ]
  },
  {
    slug: "civil-registry",
    name: "Civil Registry",
    description:
      "Humingi ng kopya ng birth, marriage, at death certificates, at magsampa ng late registration.",
    office: "Office of the City Civil Registrar",
    category: "civil-registration",
    process: []
  },
  {
    slug: "psa-birth-certificate",
    name: "PSA Birth Certificate",
    description:
      "Kumuha ng certified copy ng birth certificate mula sa Philippine Statistics Authority (PSA). Ang Lucena CRS outlet ay nasa 3rd Floor, Pacific Mall, M.L. Tagarao St., Brgy. 3, Lucena City. Puwede ring mag-order online para maihatid o ma-pick up.",
    office: "Philippine Statistics Authority (PSA) — Lucena CRS Outlet",
    category: "civil-registration",
    source: "https://psa.gov.ph/birth-certificate",
    process: [
      {
        name: "Mag-book ng appointment online (para sa walk-in)",
        details: [
          "Pumunta sa https://appointment.psa.gov.ph/ at piliin ang Region IV-A (CALABARZON) at ang Quezon/Lucena outlet.",
          "Isulat ang pangalan at email ng taong personal na pupunta, i-verify ang one-time PIN, piliin ang Birth Certificate, petsa, at oras. I-save ang appointment slip — libre ang pag-book at hindi ito pwedeng ipasa sa iba.",
          "Kinakailangan ang appointment para sa walk-in at hindi pwedeng mag-book ang mga menor de edad. Kung walang available na slot, subukang muli o gamitin ang online ordering.",
        ],
      },
      {
        name: "Ihanda ang mga kinakailangang detalye at dokumento",
        details: [
          "Buong pangalan ng may-ari ng record, pangalan ng ama, maiden name ng ina, petsa at lugar ng kapanganakan (lungsod/bayan at probinsya), kung late registered at ang taon, pangalan at address ng humihingi, relasyon, bilang ng kopya, at layunin.",
          "Magdala ng valid ID at ng appointment slip. Kung kumakatawan sa iba: valid ID ng may-ari, sariling valid ID, at authorization letter o SPA na partikular na nagsasaad na para ito sa PSA civil registry document.",
          "Confidential ang birth record — karaniwang ang may-ari, asawa, magulang, direktang descendants, legal guardian, o authorized representative ang pwedeng humingi.",
        ],
      },
      {
        name: "Pumunta sa PSA Lucena outlet o mag-order online",
        details: [
          "Walk-in: 3rd Floor, Pacific Mall, M.L. Tagarao St., Brgy. 3, Lucena City (Lunes–Biyernes). Dumating nang maaga at ipakita ang appointment slip.",
          "Online: mag-order sa https://www.psaserbilis.com.ph para sa delivery o LBC pickup, o sa https://psahelpline.ph para sa delivery, store pickup, o E-Certificate.",
        ],
      },
      {
        name: "Magbayad at tanggapin ang certificate",
        timeEstimation: "Karaniwang ilang oras sa outlet; humigit-kumulang 6–8 araw ng trabaho para sa online delivery sa mga probinsya",
        amount: "₱155 bawat kopya sa outlet; ₱330 para sa unang kopya via PSA Serbilis delivery (maaaring magbago)",
        details: [
          "Sa outlet, bayaran ang fee at tanggapin ang certificate sa araw ng appointment kung nasa database na ang record; ang manual verification ay maaaring tumagal ng ilang araw.",
          "Suriin ang spelling ng pangalan, petsa, at lugar ng kapanganakan bago umalis. Para sa delivered copy, ipakita ang valid ID sa courier o sa pickup branch.",
          "Kung hindi pa nasa PSA database ang record, maaaring kailanganin muna ang certification mula sa Local Civil Registrar bago ang PSA copy.",
        ],
      },
    ],
  },
  {
    slug: "real-property-tax",
    name: "Real Property Tax",
    description:
      "I-assess at bayaran ang real property tax, humingi ng tax clearance, at i-update ang property records.",
    office: "City Assessor & City Treasury",
    category: "business",
    process: []
  },
  {
    slug: "health-services",
    name: "Health Services",
    description:
      "Mag-access ng consultation, immunization, maternal care, at mga medical assistance program.",
    office: "City Health Office",
    category: "health",
    process: []
  },
  {
    slug: "yakap-program",
    name: "Philhealth YAKAP Program",
    description: "Ang YAKAP program (Yaman ng Kalusugan Program o Yamang Kalusugan at Proteksyon) ay ang pinapalawak na primary care at preventive healthcare program ng Philippine Health Insurance Corporation (PhilHealth). Inilunsad ito bilang ebolusyon ng mas lumang Konsulta program, at binabago ng YAKAP ang healthcare system mula sa pagtreat ng malalang sakit sa ospital patungo sa maagang pag-detect ng health problems sa pamamagitan ng regular na checkup at community clinic.",
    office: "Lucena City Health",
    category: "health",
    source: "https://www.philhealth.gov.ph/",
    process: [
      {
        name: "I-verify o I-update ang iyong PhilHealth Membership",
        details: [
          "Tiyaking mayroon kang aktibong PhilHealth Identification Number (PIN) at na-update na Member Data Record (MDR).",
          "Kung kailangan magrehistro o i-update ang records, maaari kang pumunta sa PhilHealth Local Health Insurance Office (LHIO) Lucena o makipag-ugnayan sa City Health Office (CHO) Lucena.",
        ],
      },
      {
        name: "Pumili ng Akreditadong YAKAP Clinic",
        details: [
          "Pumili ng akreditadong Primary Care Provider (PCP) o YAKAP clinic sa Lungsod ng Lucena (maraming akreditadong health center, klinika, at ospital sa lungsod).",
          "Maaari kang magrehistro at magtalaga ng clinic sa pamamagitan ng eGovPH Super App, PhilHealth Member Portal, o sa pagpunta nang diretso sa opisina ng LHIO Lucena.",
        ],
      },
      {
        name: "Dumaan sa First Patient Encounter (FPE)",
        details: [
          "Pumunta sa napili mong akreditadong YAKAP clinic o health center sa Lungsod ng Lucena.",
          "Suriin ka ng staff ng clinic sa pamamagitan ng digital liveness check at health assessment (First Patient Encounter).",
          "May karapatan ka nito sa libreng primary care checkup, basic laboratory tests, cancer screening, at reseta na may Unique Prescription Security Code (UPSC) kung kinakailangan.",
        ],
      },
      {
        name: "Kumuha ng Libreng Gamot sa pamamagitan ng GAMOT",
        details: [
          "Kung may reseta para sa essential medicines (bahagi ng 75 available na gamot sa GAMOT package), dalhin ang reseta/UPSC sa isang GAMOT-accredited na parmasya.",
          "Maaari kang kumuha ng hanggang ₱20,000 taunang halaga ng libreng gamot.",
        ],
      },
    ]
  },
  {
    slug: "free-med",
    name: "Free Medicine from Yakap Program",
    description: "Libreng gamot para sa mga residente ng Lucena sa pamamagitan ng YAKAP/GAMOT program. Magparehistro sa barangay health center o City Health Office: kailangan ang Government ID para sa 18 taong gulang pataas, at birth certificate para sa 17 taong gulang pababa.",
    office: "Barangay Health Center/City Health Office",
    category: "health",
    process: [
      {
        name: "Pumunta at Magparehistro sa Barangay Health Center o City Health Office",
        details: [
          "Magpunta sa barangay health center o sa City Health Office ng Lucena para magparehistro sa Libreng Gamot (YAKAP/GAMOT) program.",
        ],
      },
      {
        name: "Ihanda ang mga Kinakailangang Dokumento",
        details: [
          "18 taong gulang pataas: magdala ng Government ID.",
          "17 taong gulang pababa: magdala ng birth certificate.",
        ],
      },
    ],
  },
  {
    slug: "social-services",
    name: "Social Welfare Services",
    description:
      "Social assistance, senior citizen at PWD ID, at suporta para sa mga indigent resident.",
    office: "City Social Welfare and Development Office",
    category: "health",
    process: []
  },
  {
    slug: "building-permits",
    name: "Building & Construction Permits",
    description:
      "Kumuha ng building permit at occupancy permit, at i-coordinate ang mga inspeksyon.",
    office: "Office of the City Building Official",
    category: "business",
    process: [
      {
        name: "I-verify o I-update ang iyong PhilHealth Membership",
        timeEstimation: "Sa loob ng 3–5 araw ng trabaho",
        amount: "Kasama sa mga nakatakdang bayaran",
      }
    ]
  },
  {
    slug: "employment",
    name: "Employment Assistance",
    description:
      "Job matching, lokal na employment facilitation, at special program para sa employment ng mga estudyante.",
    office: "Public Employment Service Office (PESO)",
    category: "education",
    process: []
  },
  {
    slug: "brgy-services",
    name: "Barangay Clearance",
    description:
      "Opisyal na dokumento mula sa iyong barangay na nagpapatunay na bona fide resident ka, may good moral character, at walang pending complaint, blotter record, o case sa antas ng barangay. Karaniwang kailangan para sa employment, business at building permit, bank account, loan, at school requirements.",
    office: "Barangay Hall (Punong Barangay)",
    category: "barangay",
    source: "https://barangayclearance.ph/",
    process: [
      {
        name: "Ihanda ang iyong mga Dokumento",
        details: [
          "Magdala ng valid ID, patunay ng paninirahan (utility bill, lease contract, o voter registration), punong form ng aplikasyon, bayaran para sa clearance, at cedula kung hihilingin ito ng barangay.",
          "Magdala ng orihinal at isang photocopy ng bawat dokumento. Karaniwang tinatanggap na ID: national ID, driver's license, passport, UMID, voter's certification, PRC ID, school ID, at company ID.",
        ],
      },
      {
        name: "Pumunta sa Barangay Hall ninyo",
        details: [
          "Pumunta sa barangay kung saan ka talaga nakatira, hindi kung saan ka ipinanganak. Awtomatikong pagtanggi ang aplikasyon sa barangay na hindi mo tinitirhan.",
          "Karaniwang bukas ang opisina mula 8:00 AM hanggang 5:00 PM, Lunes hanggang Biyernes; may ilang barangay na bukas Sabado ng umaga.",
        ],
      },
      {
        name: "Kumuha at Punan ang Form ng Aplikasyon",
        details: [
          "Isulat ang buong pangalan, kumpletong address, edad, civil status, contact number, at layunin.",
          "Isulat ang layunin eksakto kung paano ito nakasaad sa opisinang tatanggap: ang “For Employment”, “For Business Permit”, at “For Bank Requirement” ay hindi magpapalitan.",
        ],
      },
      {
        name: "Isumite ang mga Kinakailangan at Ipacheck ang Blotter",
        details: [
          "Iabot ang form, ID, at mga dokumento. Susuriin ng staff ang barangay blotter para sa anumang record sa pangalan at address mo — ito ang aktwal na hakbang ng clearance.",
          "Ang nakabinbing reklamo o kaso sa barangay ay magpapahinto sa clearance hangga't hindi ito naaayos sa pamamagitan ng Lupong Tagapamayapa.",
        ],
      },
      {
        name: "Magbayad ng Bayaran",
        timeEstimation: "Ilang minuto",
        amount: "Para sa personal na gamit ₱20–₱100; para sa negosyo kadalasang ₱200–₱1,000+",
        details: [
          "Bawat barangay ang nagtatakda ng sariling rate sa ilalim ng Local Government Code. Ang first-time job seekers ay hindi nagbabayad sa ilalim ng RA 11261, at ang mga indigent resident ay madalas libre kapag may certificate of indigency.",
          "Magdala ng eksaktong pera at itago ang official receipt, dahil baka hingan ito ng permit office pagkatapos.",
        ],
      },
      {
        name: "Hintayin ang Pagproseso at Tanggapin ang Clearance",
        timeEstimation: "Karaniwang 10–30 minuto ang paglabas para sa walk-in",
        details: [
          "Suriin ang spelling ng pangalan, address, at layunin, pati ang dry seal, petsa, at lagda ng barangay captain. Kung walang dry seal, hindi valid ang clearance.",
          "Ang validity ay 6 na buwan hanggang 1 taon sa karamihang barangay, ngunit maraming employer at bangko ang tumatanggap lamang ng kopyang inisyu sa nakaraang 3 buwan.",
        ],
      },
    ],
  },
  {
    slug: "cedula",
    name: "Cedula (Community Tax Certificate)",
    description:
      "Tinatawag ding community tax certificate o residence certificate, ang cedula ay inisyu sa barangay hall o city treasurer's office at hinihingi ng maraming barangay kapag nag-aapply ng clearance o certificate.",
    office: "Barangay Hall / City Treasurer's Office",
    category: "barangay",
    source: "https://barangayclearance.ph/",
    process: [
      {
        name: "Kumpirmahin Kung Kailangan ito ng Barangay ninyo",
        details: [
          "Maraming barangay ang humihingi ng cedula, ngunit hindi lahat ay sapilitan para sa personal na clearance. Magtanong muna sa desk para hindi ka magbalik-balik.",
        ],
      },
      {
        name: "Ihanda ang iyong mga Detalye",
        details: [
          "Magdala ng valid ID at mga basic personal details. Ang bayaran ay nakasalalay sa idineklarang kita, kaya isulat ito nang tama.",
        ],
      },
      {
        name: "Mag-apply sa Barangay Hall o City Treasurer's Office",
        details: [
          "Binibili ang cedula sa parehong barangay hall kung saan kukuha ng clearance, o sa city treasurer's office.",
        ],
      },
      {
        name: "Magbayad ng Bayaran",
        amount: "Ang basic rate ay nagsisimula sa ilang piso at tumataas ayon sa idineklarang kita",
        details: [
          "Karamihan sa mga residente ay nagbabayad ng maliit na halaga. Itago ang official receipt para sa sariling tala.",
        ],
      },
    ],
  },
  {
    slug: "barangay-indigency",
    name: "Barangay Certificate of Indigency",
    description:
      "Sertipiko mula sa barangay na nagpapatunay na limitado ang kita mo o ng iyong sambahayan at hindi kayang bayaran ang fee o serbisyo. Tinatanggap ito ng mga ospital, DSWD, at legal aid office para sa financial aid at fee waiver, at madalas gamitin ng mga indigent resident para libreng makuha ang barangay clearance.",
    office: "Barangay Hall",
    category: "barangay",
    source: "https://barangayclearance.ph/",
    process: [
      {
        name: "Ihanda ang iyong mga Dokumento",
        details: [
          "Magdala ng valid ID, patunay ng address, at mga dokumentong nagpapakita ng pinansyal na kalagayan ng sambahayan.",
        ],
      },
      {
        name: "Humingi ng Sertipiko sa Barangay Hall",
        details: [
          "Pinatutunayan ng certificate of indigency ang limitadong kita para sa tulong at pagwawaksi ng bayaran. Mag-aapply ka sa parehong desk at form na ginagamit para sa ibang sertipiko ng barangay.",
          "Isulat ang eksaktong layunin upang tumugma sa inaasahan ng tatanggap na opisina, halimbawa: tulong sa bill ng ospital, gamot, o tulong sa paglilibing.",
        ],
      },
      {
        name: "Magbayad ng Bayaran (kung mayroon)",
        amount: "Maliit na bayarang itinakda ng ordinansa, madalas libre",
        details: [
          "Karaniwang maliit ang bayaran, at may ilang barangay na nagbibigay nito nang libre.",
        ],
      },
      {
        name: "Tanggapin at Suriin ang Sertipiko",
        timeEstimation: "Madalas inisyu sa parehong araw",
        details: [
          "Kumpirmahin ang dry seal at lagda — maaaring tanggihan ng opisina ang dokumento kung wala ang mga ito.",
          "Karamihang opisina ay tumatanggap ng sertipiko sa loob ng 3 hanggang 6 na buwan. Magtanong sa humihinging opisina, gaya ng ospital o DSWD, dahil may ilang nangangailangan ng mula sa city social welfare office sa halip.",
        ],
      },
    ],
  },
  {
    slug: "scholarship",
    name: "Scholarship Programs",
    description:
      "Mga scholarship na pinondohan ng lungsod para sa mga qualified na estudyante ng Lucena City.",
    office: "City Scholarship Office",
    category: "education",
    process: []
  },
];
