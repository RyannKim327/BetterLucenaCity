import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { site } from "@/lib/data/site";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";
import MainLayout from "@/components/layout/main";

const themeInitScript = `(function(){try{var t=localStorage.getItem("betterlucena-theme")||"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${site.name}`,
    template: `%s · ${site.name}`,
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  robots: {
    follow: true,
    index: true
  },
  authors: [
    {
      name: "RyannKim327",
      url: "https://github.com/RyannKim327"
    },
    {
      name: "Kurt Atoat",
      url: "https://github.com/seiyanndev"
    },
    {
      name: "Mark Louie Alvarez",
      url: "https://github.com/marrrkkk"
    }
  ],
  keywords: [
    "Better Lucena City",
    "Lucena City Transparency",
    "What is Lucena City",
    "BetterGov PH",
    "BetterLucenaCity",
    "Lucena City Services",
    "Lucena City History",
    "Lucena City Population",
    "Lucena City Website",
    "Lucena City",
    "Lucena Website"
  ],
  description: site.description,
  icons: {
    icon: "/better-lucena-city.svg"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="h-dvh w-dvw flex flex-col antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
