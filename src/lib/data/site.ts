export const site = {
  name: "Better Lucena City",
  locality: "Lucena City",
  province: "Quezon",
  tagline: "A brighter city for every Lucenahin.",
  description:
    "A community-driven platform that makes Lucena's government information and public services more accessible, transparent, and easy to navigate.",
  cityHallAddress:
    "Mayao Kanluran, Lucena City, Quezon 4301, Philippines",
  email: "",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/transparency", label: "Transparency" },
  { href: "/legal", label: "Ordinances" },
  { href: "/announcements", label: "Announcements" },
  { href: "/contact", label: "Hotlines" },
  { href: "/contributors", label: "Contributors" }
] as const;
