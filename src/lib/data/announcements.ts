export interface Announcement {
  id: string;
  title: string;
  date: string;
  excerpt: string;
}

export const announcements: Announcement[] = [
  {
    id: "sample-water-interruption",
    title: "Advisory: Scheduled water service interruption in Barangay 7",
    date: "2026-08-21",
    excerpt:
      "Maintenance work along Quezon Avenue may affect water supply from 9:00 AM to 4:00 PM. Please store water accordingly.",
  },
  {
    id: "sample-business-renewal-window",
    title: "Early renewal window opens for business permits",
    date: "2026-08-15",
    excerpt:
      "Renew your business permit early and avoid the January rush. Requirements and payment centers are listed on the Services page.",
  },
  {
    id: "sample-vaccination-drive",
    title: "Free anti-rabies vaccination drive for pets this weekend",
    date: "2026-08-10",
    excerpt:
      "Bring your cats and dogs to designated barangay vaccination sites on August 29–30. First come, first served.",
  },
];

export const emergencyHotlines = [
  { name: "Emergency (National)", number: "911" },
  { name: "City Disaster Risk Reduction", number: "(042) XXX-XXXX" },
  { name: "Police Station", number: "(042) XXX-XXXX" },
  { name: "Fire Station", number: "(042) XXX-XXXX" },
] as const;
