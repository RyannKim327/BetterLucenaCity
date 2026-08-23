export const site = {
  name: "BetterLucena",
  locality: "Lucena City",
  province: "Quezon",
  tagline: "Para sa bayan. Para sa kinabukasan.",
  description:
    "A citizen-first portal for Lucena City government services, announcements, and public data.",
  cityHallAddress:
    "Mayao Kanluran, Lucena City, Quezon 4301, Philippines",
  email: "info@bettergov.ph",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/transparency", label: "Transparency" },
  { href: "/legal", label: "Ordinances" },
  { href: "/announcements", label: "Announcements" },
  { href: "/contact", label: "Contact" },
] as const;
