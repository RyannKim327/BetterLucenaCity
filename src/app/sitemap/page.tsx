import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Human-readable sitemap of BetterLucenaCity — all public user-facing pages. Administrative routes are excluded. Report page follows RA 10173 (Data Privacy Act) and RA 11313 (Safe Spaces Act) plus Philippine anti-discrimination laws.",
};

type SitemapNode = {
  href: string;
  label: string;
  description: string;
  badge?: string;
  children?: SitemapNode[];
};

const sitemap: SitemapNode[] = [
  {
    href: "/",
    label: "Home",
    description:
      "Landing page — Hero, About Lucena, featured services, announcements preview, and live civic data (weather, earthquakes, DPWH projects, map).",
    badge: "Public",
  },
  {
    href: "/services",
    label: "Services",
    description:
      "City Services directory — Business Permits, Civil Registry, Real Property Tax, Health, Social Welfare, Building Permits, PESO, Scholarships. Each card shows office, description, and process table (time/amount).",
    badge: "Public",
  },
  {
    href: "/transparency",
    label: "Transparency",
    description:
      "Open Books, Open Government — Budget & Spending, National Budget (GAA FY2020–2026 via BetterGov.ph API, #national-budget), Procurement, Ordinances & Resolutions, Full Disclosure Policy.",
    badge: "Public",
    children: [
      {
        href: "/transparency#national-budget",
        label: "#national-budget",
        description: "Live National Budget section embedded on the transparency page.",
      },
      {
        href: "/legal",
        label: "/legal (cross-link)",
        description: "Transparency → Ordinances & Resolutions links to the legal collection.",
      },
    ],
  },
  {
    href: "/legal",
    label: "Ordinances — Laws & City Ordinances",
    description:
      "Legal foundations of Lucena City (charter 1961 to present) — ordinances, resolutions, executive orders, memoranda. Query filter: ?type=ordinance|resolution|executive-order|memorandum.",
    badge: "Public",
  },
  {
    href: "/announcements",
    label: "Announcements",
    description: "Public advisories, notices, and updates from the City Government of Lucena.",
    badge: "Public",
  },
  {
    href: "/contact",
    label: "Contact",
    description:
      "Visit City Hall (Mayao Kanluran, Lucena 4301), office hours Mon–Fri 8AM–5PM, email info@bettergov.ph, emergency hotlines grid.",
    badge: "Public",
  },
  {
    href: "/contributors",
    label: "Contributors",
    description:
      "People behind the project — username-only listing (opt-in/out), roles: Head Maintainer / Maintainer / Data Validator / Data Collaborator / Tester. Link to /contribute to request a role.",
    badge: "Public",
  },
  {
    href: "/report",
    label: "Report harassment & discrimination",
    description:
      "Private report page for harassment, gender-based harassment, discrimination, or data privacy concerns. Enforces RA 11313 (Safe Spaces Act / Bawal Bastos Law), RA 7877 (Anti-Sexual Harassment Act), RA 9710/RA 9262 (Magna Carta of Women / Anti-VAWC), and RA 10173 (Data Privacy Act of 2012) for confidentiality; plus RA 7277/RA 10524 (PWD), RA 10911 (Anti-Age Discrimination), RA 11166 (HIV Policy Act) and 1987 Constitution anti-discrimination protections. Email fallback conduct@bettergov.ph — submission is private to Head Maintainers only.",
    badge: "Public · Private submission",
  },
  {
    href: "/contribute",
    label: "Contribute",
    description:
      "Contributor portal — entry hub with 5 section cards. Requires sign-in (Google/GitHub) + approved role with collect permission. Unauthenticated users see sign-in + guidelines; pending users see approval state; testers see limited-access notice.",
    badge: "Auth · Approved",
    children: [
      {
        href: "/contribute/contacts",
        label: "/contribute/contacts",
        description: "Contacts & Hotlines — split layout: form (left) + recent contacts list (right). Needs reliable source.",
      },
      {
        href: "/contribute/services",
        label: "/contribute/services",
        description: "City Services — split layout: form (left) + recent services list (right). Include office & source.",
      },
      {
        href: "/contribute/transparency",
        label: "/contribute/transparency",
        description:
          "Transparency Data — CSV/JSON upload, client-side parse, table preview, only parsed rows sent to DB (no file stored).",
      },
      {
        href: "/contribute/announcement",
        label: "/contribute/announcement",
        description: "Announcements — centered form for advisories, notices, public updates. Factual & non-partisan.",
      },
      {
        href: "/contribute/ordinances",
        label: "/contribute/ordinances",
        description:
          "Ordinances & Legal — centered form for ordinances, resolutions, EOs, memoranda with references for validation.",
      },
    ],
  },
];

const excluded: Array<{ path: string; reason: string }> = [
  { path: "/admin", reason: "Administrative — pending contributors (approved = false) vetting. Requires admin permission; redirects to / otherwise. Excluded from sitemap.xml and robots disallow." },
  { path: "/discussion", reason: "Private 3-way discussion (Source ↔ Validator ↔ Head Maintainer). Requires discuss permission; redirects to / otherwise. Not indexed." },
];

function SitemapCard({ node, depth = 0 }: { node: SitemapNode; depth?: number }) {
  return (
    <div className={depth > 0 ? "ml-4 border-l border-outline-variant/30 pl-4" : ""}>
      <Card className="flex flex-col flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <Link href={node.href} className="text-sm font-semibold text-primary hover:underline">
            {node.label}
          </Link>
          {node.badge && (
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${node.badge.includes("Auth")
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-primary-container text-on-primary-container"
                }`}
            >
              {node.badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-on-surface-variant">{node.href}</p>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{node.description}</p>
      </Card>
      {node.children && node.children.length > 0 && (
        <div className="mt-3 space-y-3">
          {node.children.map((child) => (
            <SitemapCard key={child.href} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SitemapPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Navigation · Sitemap"
        title="Sitemap — User View"
        description="Every public page a citizen can visit. Administrative and private routes are listed separately and are excluded from sitemap.xml / search indexing."
      />

      {/* Global shell — Header + Footer already in layout.tsx */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-container px-3 py-1 font-medium text-on-primary-container">
            Public — no sign-in required
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-3 py-1 font-medium text-on-secondary-container">
            Auth · Approved — sign-in + approved role
          </span>
          <Link href="/sitemap.xml" className="ml-auto text-xs font-medium text-primary hover:underline">
            View sitemap.xml →
          </Link>
          <Link href="/robots.txt" className="text-xs font-medium text-primary hover:underline">
            robots.txt →
          </Link>
        </div>

        {/* Visual hierarchy */}
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {sitemap.map((node) => (
            <SitemapCard key={node.href} node={node} />
          ))}
        </div>

        {/* Excluded section */}
        <Card className="mt-8 border-dashed">
          <h2 className="text-sm font-semibold">Excluded from public sitemap</h2>
          <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
            Not in <code className="rounded bg-surface-container px-1 py-0.5">sitemap.xml</code> and blocked in{" "}
            <code className="rounded bg-surface-container px-1 py-0.5">robots.txt</code>. Included here for transparency.
          </p>
          <ul className="mt-4 space-y-3">
            {excluded.map((item) => (
              <li key={item.path} className="rounded-xl border border-outline-variant/30 bg-surface-container px-3 py-2.5">
                <p className="text-sm font-medium text-on-surface">
                  <code className="rounded bg-surface-container-low px-1.5 py-0.5 text-xs">{item.path}</code>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">{item.reason}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mt-4 border-primary/20 bg-primary-container/10">
          <h3 className="text-sm font-semibold">Legal basis — privacy & anti-discrimination</h3>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            The <span className="font-medium text-on-surface">/report</span> flow and all private discussions (Source ↔ Validator ↔ Head Maintainer) are handled in compliance with <span className="font-medium text-on-surface">RA 10173 (Data Privacy Act of 2012)</span> — personal data is confidential, minimal, and disclosed only with consent or lawful order.
          </p>
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-on-surface-variant">
            <li>• <span className="font-medium text-on-surface">RA 11313 (Safe Spaces Act / Bawal Bastos Law)</span> + <span className="font-medium text-on-surface">RA 7877 (Anti-Sexual Harassment Act)</span> — gender-based & sexual harassment, including online</li>
            <li>• <span className="font-medium text-on-surface">RA 9710 (Magna Carta of Women)</span> & <span className="font-medium text-on-surface">RA 9262 (Anti-VAWC)</span> — gender equality & protection of women/children</li>
            <li>• <span className="font-medium text-on-surface">RA 7277 as amended by RA 10524, RA 10911, RA 11166</span> & 1987 Constitution Art. XIII — anti-discrimination on disability, age, health status, ethnicity, religion, and other protected status</li>
          </ul>
          <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
            RA 10173 and RA 11313 are complementary: harassment reports often contain sensitive personal information, so confidentiality (RA 10173) and safe-spaces protection (RA 11313) are enforced together.
          </p>
        </Card>

        {/* Site shell note */}
        <Card className="mt-4">
          <h3 className="text-sm font-semibold">Site shell (on every page)</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-on-surface-variant">
            <li>
              <span className="font-medium text-on-surface">Header</span> — Lucena City branding + primary nav (Home, Services, Transparency, Ordinances, Announcements, Contact) + theme toggle + mobile drawer + emergency hotlines bar.
            </li>
            <li>
              <span className="font-medium text-on-surface">Footer</span> — About (BetterLucenaCity description + City Hall address), Navigate (same 6 nav links), Emergency Hotlines, copyright tagline, link to /contributors “Be one of us? Be a contributor?”.
            </li>
            <li>
              <span className="font-medium text-on-surface">Home sections</span> (at /) — Hero (map + CTA), About Lucena, Services preview, Announcements preview, Live Data (weather/earthquakes/DPWH/map).
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
