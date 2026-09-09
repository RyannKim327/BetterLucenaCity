import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Better LucenaCity",
    short_name: "Lucena City",
    description: "BetterLucenaCity is a community-driven platform that makes Lucena's government information and public services more accessible, transparent, and easy to navigate.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/better-lucena-city.png",
        sizes: "192x192",
        type: "image/png",
      }
    ],
  };
}
