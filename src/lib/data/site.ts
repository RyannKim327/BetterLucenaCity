export const site = {
  name: "BetterLucenaCity",
  locality: "Lucena City",
  province: "Quezon",
  tagline: "Para sa bayan. Para sa kinabukasan.",
  description:
    "A community-driven platform that makes Lucena's government information and public services more accessible, transparent, and easy to navigate.",
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
