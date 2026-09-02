import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Better Lucenacity",
    short_name: "Lucenacity",
    description: "Better Lucenacity",
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
