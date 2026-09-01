import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ContributeForm } from "@/components/sections/contribute-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ContributePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Layout already handles unauthenticated state; this is a fallback for direct rendering
  if (!user) return null;

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "";

  return (
    <div className="-mx-4 -my-16 sm:-mx-6">
      <PageHeader
        eyebrow="Pakikibahagi · Transparency"
        title="Contribute — beyond code"
        description="You don't need to be a developer to help. Gather, verify, validate, and share information that makes Lucena City governance more transparent — anyone can submit a valid report from a reliable source with supporting documents."
      />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.6fr_0.9fr]">
        {/* Main form */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-base font-semibold">Share information or a report</h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Use this form to submit announcements, service updates, budget/project data, or any transparency-related
              report. Every submission is reviewed by a <span className="font-medium text-on-surface">Data Validator</span> before publication.
              Please be factual, non-partisan, and privacy-respecting.
            </p>
            <div className="mt-6">
              <ContributeForm user={{ name: displayName, email: user.email ?? "" }} />
            </div>
          </Card>

          <p className="px-1 text-xs leading-relaxed text-on-surface-variant">
            For your privacy, <span className="font-medium text-on-surface">do not create a public GitHub Issue</span> for reports, corrections, or datasets. All data submissions — including large or sensitive ones — stay in a <span className="font-medium text-on-surface">private website discussion</span> among you (Source), the Validator, and the Head Maintainer to protect your identity and well-being. See{" "}
            <Link href="/contributors" className="font-medium text-primary hover:underline">
              CONTRIBUTING.md
            </Link>{" "}
            for full guidelines. Use GitHub Issues only for code/bug reports, not personal data disclosures.
          </p>
        </div>

        {/* Sidebar: guidance */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold">What you can contribute (no code needed)</h3>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-on-surface-variant">
              <li>
                <span className="font-medium text-on-surface">Gather</span> — collect public info on LGU services,
                fees, hotlines, ordinances, or programs from official sources.
              </li>
              <li>
                <span className="font-medium text-on-surface">Verify &amp; validate</span> — double-check existing
                details (e.g., office hours, addresses) and flag outdated entries with the correct value + source.
              </li>
              <li>
                <span className="font-medium text-on-surface">Report</span> — share budget data, project status,
                procurement notices, or advisories with a reference link or document.
              </li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold">Requirements for every report</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Anyone is welcome to share a report — it <span className="font-medium text-on-surface">must be valid, from a reliable source, with supporting documents whenever possible.</span>
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-on-surface-variant">
              <li>• <span className="font-medium">Reliable source:</span> lucena.gov.ph, City Hall postings, official LGU Facebook pages, DBM / DPWH / PSA / DILG portals, published ordinances, FOI/COA reports, or reputable news that cites the primary document.</li>
              <li>• <span className="font-medium">Supporting document:</span> URL to PDF/ordinance/dataset, photo or scan of the bulletin (with date &amp; venue), screenshot + post URL, or reference number / date / issuing office.</li>
              <li>• No secondary-only claims — if you cite news, include the primary reference it mentions. Without any verifiable reference, your submission will be held until validated.</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold">How review works</h3>
            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
              Routine reports are reviewed by a <span className="font-medium text-on-surface">Data Validator</span> and published with attribution if valid.
            </p>
            <div className="mt-3 rounded-xl border border-outline-variant/40 bg-surface-container px-3 py-3">
              <p className="text-xs font-semibold text-on-surface">
                For data corrections &amp; larger datasets — private 3-way discussion on the website (not GitHub):
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">
                To protect your privacy and mental health, this discussion is <span className="font-medium text-on-surface">never a public GitHub Issue</span> — only you, the Validator, and the Head Maintainer can see the thread.
              </p>
              <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed text-on-surface-variant">
                <li>
                  <span className="font-medium text-on-surface">Source (you)</span> submits via this form — the submission becomes a <span className="font-medium">private</span> discussion thread (not public).
                </li>
                <li>
                  <span className="font-medium text-on-surface">Data Validator</span> (research-literate, non-partisan) checks authenticity &amp; cross-references, then asks for more supporting docs <em>in the thread</em>.
                </li>
                <li>
                  <span className="font-medium text-on-surface">You reply in-thread</span> with clarifications, clearer scans, or primary URLs — everything stays on-platform for auditability.
                </li>
                <li>
                  Validator posts a recommendation (approve / revise / reject).
                </li>
                <li>
                  <span className="font-medium text-on-surface">Head Maintainer (administrator)</span> reviews the full thread and gives the final decision — publish, return, or reject with a written non-partisan reason.
                </li>
              </ol>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
              This prevents false information and quiet edits. Accuracy over speed — even one verified correction (e.g., hotline hours with office signage photo + city URL) is credited.
            </p>
          </Card>

          <Card className="border-primary/20 bg-primary-container/20">
            <h3 className="text-sm font-semibold">Register for Data Gathering &amp; Validator roles</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              You&apos;re already signed in — that account is your contributor profile. You may request:
            </p>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-on-surface-variant">
              <li>• <span className="font-medium text-on-surface">Data Collaborator</span> — for anyone who regularly gathers and submits public reports. No formal credentials needed; reliability is what matters.</li>
              <li>• <span className="font-medium text-on-surface">Data Validator</span> — for reviewers who approve submissions before publication.</li>
            </ul>
            <div className="mt-3 rounded-xl bg-surface-container-low px-3 py-2.5">
              <p className="text-xs font-semibold text-on-surface">Validator must have:</p>
              <ul className="mt-1.5 space-y-1.5 text-xs leading-relaxed text-on-surface-variant">
                <li>• <span className="font-medium">Research knowledge</span> — can trace primary sources, check reference no./seal/date, cross-reference, and spot altered/AI-generated documents to prevent false information.</li>
                <li>• <span className="font-medium">Non-partisan impartiality</span> — must not cherry-pick or suppress data to favor or oppose any political party, family, or candidate. All verifiable public-interest data is treated equally.</li>
                <li>• Willingness to disclose conflicts, recuse when involved, and correct published entries when new evidence appears.</li>
              </ul>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
              To request a role, message the Head Maintainer or a Maintainer privately via the website (not a public Issue) — include the role you want, a brief note on your research experience, and 1–2 sources you&apos;ve verified. Roles are assigned via the <code className="rounded bg-surface-container px-1 py-0.5 text-[11px]">user_type</code> enum.
            </p>
          </Card>

          <Card className="bg-surface-container">
            <h3 className="text-sm font-semibold">Privacy &amp; bayanihan</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Keep reports factual, non-partisan, and free of personal opinions. Redact private personal data (IDs, private addresses, personal phone numbers) before submitting. In the spirit of <em>malasakit</em>, we publish only what serves public transparency.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
