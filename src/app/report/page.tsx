import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function ReportPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Kaligtasan · Safe Spaces"
        title="Report harassment"
        description="If you feel harassed by another contributor — including a validator or maintainer — report it here in private. We follow RA 11313 (Safe Spaces Act / Anti-Bastos Law) and investigate professionally and without bias before judging."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <h2 className="text-base font-semibold">How to file a report</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            This form is <span className="font-medium text-on-surface">private</span> — visible only to the Head Maintainer and designated investigators, not to the public, the accused, or validators.{" "}
            <span className="font-medium text-on-surface">Do not use a public GitHub Issue</span> for harassment reports.
          </p>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-on-surface-variant">
            <li>
              Sign in (your <span className="font-medium text-on-surface">username</span> is used for privacy; your email is never shown publicly).
            </li>
            <li>Describe what happened, when/where (which private thread or page), and who was involved.</li>
            <li>
              Attach <span className="font-medium text-on-surface">screenshot or proof</span> — image, thread export, link, timestamp. Evidence is required for fair investigation.
            </li>
            <li>Submit. You will receive a system notification via the Head Maintainer&apos;s email account — validators do not email you directly.</li>
          </ol>

          <div className="mt-6 rounded-xl border border-outline-variant bg-surface-container px-4 py-3">
            <p className="text-sm font-medium">Placeholder — report form coming next</p>
            <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
              For now, please email{" "}
              <a href="mailto:conduct@bettergov.ph" className="font-medium text-primary hover:underline">
                conduct@bettergov.ph
              </a>{" "}
              with subject <code className="rounded bg-surface-container-low px-1 py-0.5 text-xs">[REPORT] RA 11313 — your username</code> and attach your screenshot/proof. Or contact the Head Maintainer privately via the website.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
              This page will directly store reports in-app with evidence upload (coming soon).
            </p>
          </div>

          <h3 className="mt-8 text-sm font-semibold">How we handle it</h3>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-on-surface-variant">
            <li>• Head Maintainers / Project Administrators investigate — <span className="font-medium text-on-surface">non-biased, investigate before judging</span>, no favor to any party, seniority, or validator status.</li>
            <li>• We must not disgrace or judge people for who they are — we work <span className="font-medium text-on-surface">professionally and ethically</span>.</li>
            <li>• Both reporter and respondent privacy is respected during the review.</li>
          </ul>

          <h3 className="mt-6 text-sm font-semibold">Consequences & evidence</h3>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            Depending on severity: formal warning to <span className="font-medium text-on-surface">disqualification or permanent ban from the system</span>. If you wish to file a case under RA 11313, the platform may — with your consent and proper legal process — provide the report and relevant private thread records as evidence.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
            Retaliation for good-faith reporting is itself a violation. See{" "}
            <Link href="/contribute" className="font-medium text-primary hover:underline">CONTRIBUTING.md</Link> and{" "}
            <Link href="/contributors" className="font-medium text-primary hover:underline">CODE_OF_CONDUCT.md</Link>.
          </p>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold">Privacy — username & email</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              You are credited by <span className="font-medium text-on-surface">username only</span>. You may opt in or out of public listing on{" "}
              <Link href="/contributors" className="font-medium text-primary hover:underline">/contributors</Link>.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Your email is <span className="font-medium text-on-surface">never displayed</span> and is used <span className="font-medium text-on-surface">only for system notifications</span> sent via the Head Maintainer&apos;s account. Validators do not email you directly — all follow-ups stay in the private website discussion.
            </p>
          </Card>
          <Card className="border-primary/20 bg-primary-container/20">
            <h3 className="text-sm font-semibold">Your well-being matters</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Data discussions (Source ↔ Validator ↔ Head Maintainer) are also private — never a public GitHub Issue — to protect your identity and mental health from public shaming.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
