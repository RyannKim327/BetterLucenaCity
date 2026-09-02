import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function ReportPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Kaligtasan · Safe Spaces"
        title="Report harassment"
        description="If you feel harassed, discriminated against, or your personal data is misused by another contributor — including a validator or maintainer — report it here in private. We enforce RA 11313 (Safe Spaces Act / Bawal Bastos Law), RA 10173 (Data Privacy Act of 2012), and other anti-discrimination laws, and investigate professionally and without bias before judging."
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
              <a href="mailto:weryses19@gmail.com" className="font-medium text-primary hover:underline">
                weryses19@gmail.com
              </a>{" "}
              with subject <code className="rounded bg-surface-container-low px-1 py-0.5 text-xs">[REPORT] RA 11313 / RA 10173 — your username</code> and attach your screenshot/proof. Or contact the Head Maintainer privately via the website.
            </p>
            <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
              All reports are handled under RA 10173 — your email, attachments, and identity are kept confidential and shared only with investigators on a need-to-know basis.
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

          <h3 className="mt-6 text-sm font-semibold">Legal basis</h3>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
            <li>• <span className="font-medium text-on-surface">RA 10173 — Data Privacy Act of 2012</span>: protects your personal information. Reports, usernames, and evidence are kept confidential; personal data is processed only with consent and lawful purpose, and never disclosed publicly.</li>
            <li>• <span className="font-medium text-on-surface">RA 11313 — Safe Spaces Act (Bawal Bastos Law)</span>: penalizes gender-based sexual harassment in streets, workplaces, online spaces, and educational institutions — including unwanted sexual remarks, misogynistic/transphobic slurs, and persistent unwanted advances.</li>
            <li>• <span className="font-medium text-on-surface">RA 7877 — Anti-Sexual Harassment Act of 1995</span>: covers work, education, or training-related sexual harassment where authority/influence is abused.</li>
            <li>• <span className="font-medium text-on-surface">RA 9710 — Magna Carta of Women</span> & <span className="font-medium text-on-surface">RA 9262 — Anti-VAWC Act</span>: guarantee gender equality and protect women and children from discrimination and violence.</li>
            <li>• <span className="font-medium text-on-surface">RA 7277 as amended by RA 10524 (Magna Carta for Persons with Disability), RA 10911 (Anti-Age Discrimination in Employment Act), RA 11166 (Philippine HIV and AIDS Policy Act)</span> & <span className="font-medium text-on-surface">Art. XIII Sec. 1, 1987 Constitution</span>: prohibit discrimination on the basis of disability, age, health status, ethnicity, religion, or other protected status.</li>
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
            This alignment means harassment that is sexual, gender-based, or discriminatory — in any form — is treated as a serious violation on the platform.
          </p>

          <h3 className="mt-6 text-sm font-semibold">Consequences & evidence</h3>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            Depending on severity: formal warning to <span className="font-medium text-on-surface">disqualification or permanent ban from the system</span>. If you wish to file a case under RA 11313, RA 7877, RA 10173, or any applicable anti-discrimination law, the platform may — with your <span className="font-medium text-on-surface">explicit consent and proper legal process</span> — provide the report and relevant private thread records as evidence, handled in strict compliance with RA 10173.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
            Retaliation for good-faith reporting is itself a violation. See{" "}
            <Link href="/contribute" className="font-medium text-primary hover:underline">CONTRIBUTING.md</Link> and{" "}
            <Link href="/contributors" className="font-medium text-primary hover:underline">CODE_OF_CONDUCT.md</Link>.
          </p>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold">Privacy — RA 10173 compliance</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              You are credited by <span className="font-medium text-on-surface">username only</span>. You may opt in or out of public listing on{" "}
              <Link href="/contributors" className="font-medium text-primary hover:underline">/contributors</Link>.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Your email is <span className="font-medium text-on-surface">never displayed</span> and is used <span className="font-medium text-on-surface">only for system notifications</span> sent via the Head Maintainer&apos;s account. Validators do not email you directly — all follow-ups stay in the private website discussion.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
              In line with <span className="font-medium text-on-surface">RA 10173 (Data Privacy Act of 2012)</span>, we follow data minimization, purpose limitation, and confidentiality: we collect only what is needed to investigate, retain it only as long as necessary, and disclose it only with your consent or when required by lawful order. You have the right to access, correct, or request deletion of your personal data — contact the Head Maintainer via the private report channel.
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
