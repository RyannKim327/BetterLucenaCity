import { PageHeader } from "@/components/layout/page-header";
import { InfoNotices } from "@/components/contribute/info-notices";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Phone,
  Briefcase,
  FileBarChart,
  Megaphone,
  Scale,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const contributeSections = [
  {
    href: "/contribute/contacts",
    title: "Contacts & Hotlines",
    description: "Add or update emergency hotlines and office contact information. Left: form · Right: recent contacts list.",
    icon: Phone,
    color: "bg-primary-container text-on-primary-container",
  },
  {
    href: "/contribute/services",
    title: "City Services",
    description: "Submit service details, fees, and office procedures. Left: form · Right: recent services list.",
    icon: Briefcase,
    color: "bg-secondary-container text-on-secondary-container",
  },
  {
    href: "/contribute/transparency",
    title: "Transparency Data",
    description: "Upload CSV or JSON datasets. Preview as table before data is sent to the database — no files stored.",
    icon: FileBarChart,
    color: "bg-primary-container text-on-primary-container",
  },
  {
    href: "/contribute/announcement",
    title: "Announcements",
    description: "Share advisories, notices, and public updates from the City. Centered form layout.",
    icon: Megaphone,
    color: "bg-secondary-container text-on-secondary-container",
  },
  {
    href: "/contribute/ordinances",
    title: "Ordinances & Legal",
    description: "Submit ordinances, resolutions, executive orders, and memoranda. Centered form layout.",
    icon: Scale,
    color: "bg-primary-container text-on-primary-container",
  },
];

export default async function ContributePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const displayName =
    (user.user_metadata?.username as string | undefined) ??
    (user.user_metadata?.user_name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "";

  return (
    <div>
      <PageHeader
        eyebrow="Pakikibahagi · Transparency"
        title="Contribute — choose a section"
        description="You don't need to be a developer to help. Gather, verify, validate, and share information that makes Lucena City governance more transparent — pick a section below to start. Anyone can submit a valid report from a reliable source with supporting documents."
      />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Intro banner */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary-container/30 px-4 py-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm leading-relaxed">
            <p className="font-medium text-on-surface">
              Signed in as {displayName ? `${displayName} · ` : ""}
              {user.email}
            </p>
            <p className="text-on-surface-variant">
              Select a card below. Each section has its own form and guidelines. All submissions stay in a{" "}
              <span className="font-medium text-on-surface">private website discussion</span> among you, a Validator, and the Head Maintainer — never a public GitHub Issue.
            </p>
          </div>
        </div>

        {/* Cards linking to subpages */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contributeSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex flex-col rounded-card border border-outline-variant/40 bg-surface-container-low p-5 shadow-elevation-1 transition-all hover:shadow-elevation-2 hover:border-primary/30"
            >
              <div className={`inline-flex size-10 items-center justify-center rounded-xl ${section.color}`}>
                <section.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-base font-semibold leading-snug group-hover:text-primary">{section.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-on-surface-variant">{section.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Open form <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}

          {/* Quick generic card for other reports */}
          <div className="rounded-card border border-dashed border-outline-variant bg-surface-container p-5">
            <h3 className="text-sm font-semibold">Other reports?</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              For corrections, verifications, or reports that don&apos;t fit the sections above, use any section&apos;s form and choose <span className="font-medium text-on-surface">“Other”</span> as category — or open a private discussion with a Validator.
            </p>
            <p className="mt-3 text-xs text-on-surface-variant">
              See <Link href="/contributors" className="font-medium text-primary hover:underline">/contributors</Link> for full guidelines.
            </p>
          </div>
        </div>

        {/* Information notices via modal */}
        <div className="mt-8">
          <InfoNotices />
        </div>

        <p className="mt-6 px-1 text-xs leading-relaxed text-on-surface-variant">
          For your privacy, <span className="font-medium text-on-surface">do not create a public GitHub Issue</span> for reports, corrections, or datasets. All data submissions stay in a private website discussion among you (Source), the Validator, and the Head Maintainer. Use GitHub Issues only for code/bug reports, not personal data disclosures.
        </p>
      </section>
    </div>
  );
}
