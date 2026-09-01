import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { AuthButtons } from "@/components/sections/auth-buttons";
import { createClient } from "@/lib/supabase/server";
import { ReactNode } from "react";

interface ContributeInterface {
  children: ReactNode
}

export default async function ContributorContainer({ children }: ContributeInterface) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div>
        <PageHeader
          eyebrow="Pakikibahagi"
          title="Contribute"
          description="A section where the community may able to share information from their reliable sources."
        />
        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr]">
          <Card>
            <h2 className="text-base font-semibold">Mag-sign in muna (Sign in first)</h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              To keep sources trustworthy, contributions are open to signed-in
              residents only. Continue with your Google or GitHub account — this
              creates your contributor profile and lets you request a{" "}
              <span className="font-medium text-on-surface">Data Collaborator</span> or{" "}
              <span className="font-medium text-on-surface">Data Validator</span> role.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
              Privacy: you&apos;ll appear publicly by <span className="font-medium text-on-surface">username only</span> (opt in/out on <code className="rounded bg-surface-container px-1 py-0.5 text-[11px]">/contributors</code>). Your email is never shown — it&apos;s used only for system notifications via the Head Maintainer&apos;s account; validators never email you directly.
            </p>
            <div className="mt-6">
              <AuthButtons
                redirectTo="/contribute"
                message="Choose a provider to continue."
              />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-on-surface-variant">
              Want to be a Data Validator? You&apos;ll need proven research skills and a strictly non-partisan stance
              (see guidelines →). Ask a Maintainer after signing in. Harassment? Report privately at <span className="font-medium text-on-surface">/report</span> with proof — RA 11313.
            </p>
          </Card>

          <div className="space-y-6">
            <Card className="h-fit">
              <h2 className="text-base font-semibold">Mga paalala (Guidelines)</h2>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                Contributing is not just coding — you can <span className="font-medium text-on-surface">gather, verify, and validate</span> data for transparency.
              </p>
              <ul className="mt-3 space-y-3 text-sm leading-relaxed text-on-surface-variant">
                <li>• <span className="font-medium text-on-surface">Anyone welcome</span> — share reports, corrections, or documents.</li>
                <li>• Must be <span className="font-medium text-on-surface">valid &amp; from a reliable source</span>: lucena.gov.ph, City Hall postings, official LGU pages, DBM/DPWH/PSA/DILG, ordinances, FOI/COA reports.</li>
                <li>• <span className="font-medium text-on-surface">Include supporting documents</span> whenever possible: link to PDF/ordinance, photo/scan with date &amp; venue, post URL, or reference no. + issuing office.</li>
                <li>• Keep details factual, non-partisan, free of opinions; redact sensitive personal data.</li>
                <li>• <span className="font-medium text-on-surface">Corrections &amp; large datasets → 3-way discussion</span> on the website between the Source (you), the Data Validator, and the Head Maintainer (admin) before publication.</li>
              </ul>
            </Card>

            <Card className="h-fit border-primary/20 bg-primary-container/20">
              <h2 className="text-sm font-semibold">Data Validators — requirements</h2>
              <ul className="mt-2 space-y-2 text-xs leading-relaxed text-on-surface-variant">
                <li>• <span className="font-medium text-on-surface">Research knowledge required</span> — must know how to trace primary sources, check reference numbers/seals/dates, and cross-reference to prevent false information.</li>
                <li>• <span className="font-medium text-on-surface">Strictly non-partisan</span> — cannot selectively approve or hide data to favor a political party, family, or candidate. All verifiable public-interest data is treated equally.</li>
                <li>• Discuss directly with the Source in-thread for corrections &amp; large datasets; the Head Maintainer is the final arbiter.</li>
                <li>• Disclose conflicts of interest and recuse when you are the author/subject of a report.</li>
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
                See <span className="font-medium">CONTRIBUTING.md → Data Validator requirements</span> for full criteria.
              </p>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return children;
  {/*(
    <div className="flex flex-col mx-auto max-w-6xl gap-4 px-4 py-16 sm:px-6">
      { children }
    </div >
  ) */}
}
