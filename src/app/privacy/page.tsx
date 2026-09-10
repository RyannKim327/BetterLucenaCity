import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for BetterLucenaCity — how we collect, use, store, and protect your data in compliance with RA 10173 (Data Privacy Act of 2012).",
};

const lastUpdated = "September 10, 2026";

export default function Privacy() {
  return (
    <div>
      <PageHeader
        eyebrow="Legal · RA 10173"
        title="Privacy Policy"
        description="How BetterLucenaCity collects, uses, and protects your information — compliant with the Data Privacy Act of 2012 (RA 10173)."
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Summary banner */}
        <Card className="border-primary/20 bg-primary-container/15">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">At a glance</p>
              <h2 className="mt-1 text-sm font-semibold text-on-surface">Privacy-first by design</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
                You are identified publicly by <span className="font-medium text-on-surface">username only</span> (opt-in/out).
                Your <span className="font-medium text-on-surface">email is never displayed</span> — it is used only for system
                notifications via the Head Maintainer. Private submissions stay in a{" "}
                <span className="font-medium text-on-surface">Source ↔ Validator ↔ Head Maintainer</span> thread, never a public
                GitHub Issue. We follow data minimisation, confidentiality, and purpose limitation under RA 10173.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-surface-container-low px-3 py-1 text-xs font-medium text-on-surface-variant">
              Last updated: {lastUpdated}
            </span>
          </div>
        </Card>

        {/* Who we are */}
        <Card className="mt-4">
          <h2 className="text-base font-semibold text-on-surface">1. Who we are — Data controller</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            <span className="font-medium text-on-surface">BetterLucenaCity</span> (BetterGov.ph LGU Agent for Lucena City,
            Quezon) is a community-driven civic portal. For data-privacy purposes, the Head Maintainer team acts as the
            Personal Information Controller.
          </p>
          <ul className="mt-3 space-y-1 text-sm leading-relaxed text-on-surface-variant">
            <li>
              • Privacy / security contact:{" "}
              <a href="mailto:weryses19@gmail.com" className="font-medium text-primary hover:underline">
                weryses19@gmail.com
              </a>{" "}
              (include &quot;PRIVACY&quot; in the subject) — also listed in{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                /contact
              </Link>
            </li>
            <li>• Address: Mayao Kanluran, Lucena City, Quezon 4301, Philippines</li>
          </ul>
        </Card>

        {/* Legal basis */}
        <Card className="mt-4">
          <h2 className="text-base font-semibold text-on-surface">2. Legal basis — RA 10173 (Data Privacy Act of 2012)</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            We process personal data on the following bases recognised under RA 10173:{" "}
            <span className="font-medium text-on-surface">consent</span> (you sign in and agree to share data for civic
            contribution), <span className="font-medium text-on-surface">legitimate purpose</span> (operating a transparent,
            non-partisan civic portal), and{" "}
            <span className="font-medium text-on-surface">compliance with legal obligations</span> where required.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            Processing follows the principles of transparency, legitimate purpose, and proportionality — we collect only what is
            necessary, use it only for the stated purpose, and keep it only as long as needed.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
            Reports that contain sensitive information (e.g., harassment under RA 11313) are handled with both{" "}
            <span className="font-medium text-on-surface">confidentiality under RA 10173</span> and{" "}
            <span className="font-medium text-on-surface">safe-spaces protection under RA 11313</span>.
          </p>
        </Card>

        {/* What we collect */}
        <Card className="mt-4">
          <h2 className="text-base font-semibold text-on-surface">3. Information we collect</h2>

          <h3 className="mt-5 text-sm font-semibold text-on-surface">3.1 Account & profile</h3>
          <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
            Created when you sign in via <span className="font-medium text-on-surface">Google or GitHub</span>. We store only
            what is needed to operate your account and give credit for contributions:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
            <li>
              • <span className="font-medium text-on-surface">Email</span> — from your sign-in provider; never displayed
              publicly and used only for system notifications.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Username</span> — your unique public handle (3–24 characters);
              shown on{" "}
              <Link href="/contributors" className="font-medium text-primary hover:underline">
                /contributors
              </Link>{" "}
              only if you opt in.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Name and profile photo</span> — optional display name and avatar
              from your sign-in provider.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Roles and account status</span> — your role (Head Maintainer,
              Maintainer, Data Collaborator, Data Validator, or Tester) and whether your account is approved or restricted. Roles
              determine what you can contribute, validate, or moderate.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Privacy preferences</span> — whether you choose to appear on the
              public contributors list and whether your profile photo is shown. You control these at{" "}
              <Link href="/user/settings" className="font-medium text-primary hover:underline">
                /user/settings
              </Link>
              .
            </li>
          </ul>

          <h3 className="mt-5 text-sm font-semibold text-on-surface">3.2 Contributions & discussions you create</h3>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
            <li>
              • <span className="font-medium text-on-surface">Contributions and private discussion threads</span> — titles,
              details, categories, source links, and supporting-document links you submit via{" "}
              <Link href="/contribute" className="font-medium text-primary hover:underline">
                /contribute
              </Link>
              . Large datasets are previewed in your browser and only the parsed rows are submitted — no raw file is stored on
              our servers.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Transparency data</span> you help verify — such as announcements,
              ordinances, budget entries, and contact information — linked to your account for provenance and accountability.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Reports</span> — the title, description, category, and source link
              you provide at{" "}
              <Link href="/report" className="font-medium text-primary hover:underline">
                /report
              </Link>
              . If you are signed in, the report is linked to your account; if you submit as a guest, we store the contact
              email you provide solely to follow up on that report. Guest submissions are limited to public report types (such
              as Data Misinformation and Security Concerns); private categories require sign-in.
            </li>
          </ul>

          <h3 className="mt-5 text-sm font-semibold text-on-surface">3.3 Automatically collected — cookies & device preferences</h3>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
            <li>
              • <span className="font-medium text-on-surface">Essential session cookies</span> — required to keep you signed in
              and to refresh your session securely. These are strictly necessary and do not require a consent banner.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Theme preference</span> — your choice of light, dark, or system
              theme is saved locally on your device and is not treated as personal data.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Offline cache</span> — static assets may be cached locally to
              support offline access. No personal data is stored in this cache.
            </li>
          </ul>

          <h3 className="mt-5 text-sm font-semibold text-on-surface">3.4 What we do NOT collect</h3>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
            <li>• No advertising cookies, cross-site trackers, or third-party analytics (no Google Analytics).</li>
            <li>• No location tracking, contact sync, or device fingerprinting.</li>
            <li>• No marketing profiling — we send no promotional emails.</li>
            <li>
              • We do not collect sensitive personal data (government IDs, private addresses, private phone numbers) — please
              redact such details before submitting.
            </li>
          </ul>
        </Card>

        {/* How we use */}
        <Card className="mt-4">
          <h2 className="text-base font-semibold text-on-surface">4. How we use your information</h2>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
            <li>• To authenticate you and maintain your session.</li>
            <li>
              • To attribute contributions for provenance while respecting your opt-in visibility choice — see{" "}
              <Link href="/contributors" className="font-medium text-primary hover:underline">
                /contributors
              </Link>{" "}
              and our contributor credit policy on{" "}
              <a
                href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CONTRIBUTING.md#privacy--public-credit--username-and-email"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                GitHub: CONTRIBUTING — Privacy & Public Credit
              </a>
              .
            </li>
            <li>
              • To send <span className="font-medium text-on-surface">system notifications only</span> about your submissions
              (received / needs more documents / published){" "}
              <span className="font-medium text-on-surface">via the Head Maintainer</span> — validators never email you
              directly; all validator-to-source communication stays in the private on-site discussion.
            </li>
            <li>
              • To moderate content and enforce the{" "}
              <a
                href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CODE_OF_CONDUCT.md"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Code of Conduct
              </a>{" "}
              (e.g., investigating harassment reports under RA 11313 — see Code of Conduct § Reporting Harassment).
            </li>
            <li>• To manage roles, approvals, and restrictions under a least-privilege model.</li>
            <li>
              • To improve data accuracy — cross-referencing sources before publishing, with correction threads linked as
              provenance.
            </li>
          </ul>
        </Card>

        {/* Visibility */}
        <Card className="mt-4">
          <h2 className="text-base font-semibold text-on-surface">5. Public vs private visibility</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Public</p>
              <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                Your <span className="font-medium text-on-surface">username</span> (and profile photo only if you have enabled
                both public listing and photo visibility) may appear on{" "}
                <Link href="/contributors" className="font-medium text-primary hover:underline">
                  /contributors
                </Link>
                . Accounts pending approval are hidden regardless of opt-in. You can change these preferences anytime at{" "}
                <Link href="/user/settings" className="font-medium text-primary hover:underline">
                  /user/settings
                </Link>
                .
              </p>
              <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
                Source:{" "}
                <a
                  href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CODE_OF_CONDUCT.md#privacy--username-email--public-credit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Code of Conduct — Privacy, Username & Public Credit
                </a>{" "}
                ·{" "}
                <a
                  href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CONTRIBUTING.md#privacy--public-credit--username-and-email"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  CONTRIBUTING — Privacy & Public Credit
                </a>
              </p>
            </div>
            <div className="rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Private</p>
              <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                Your <span className="font-medium text-on-surface">email is never displayed</span> — not on /contributors, not
                in discussion threads, not to validators. Discussion threads and{" "}
                <Link href="/report" className="font-medium text-primary hover:underline">
                  /report
                </Link>{" "}
                submissions are visible only to you, assigned Validators, and Head Maintainers (or Head Maintainers only for
                reports). Never a public GitHub Issue — private discussion protects contributor privacy and well-being as
                described in{" "}
                <a
                  href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CONTRIBUTING.md#contributing-data--reports-no-code-needed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  CONTRIBUTING — Why not GitHub Issues
                </a>
                .
              </p>
            </div>
          </div>
        </Card>

        {/* Cookies detail */}
        <Card className="mt-4">
          <h2 className="text-base font-semibold text-on-surface">6. Cookies & device storage</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant">
                  <th className="pb-2 pr-3 font-semibold">Type</th>
                  <th className="pb-2 pr-3 font-semibold">Purpose</th>
                  <th className="pb-2 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="text-sm leading-relaxed text-on-surface-variant">
                <tr className="border-b border-outline-variant/20">
                  <td className="py-2 pr-3 font-medium text-on-surface">Essential session cookies</td>
                  <td className="py-2 pr-3">Keep you signed in and refresh your session securely</td>
                  <td className="py-2">Session duration and refresh window managed by our authentication provider</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-medium text-on-surface">Theme preference</td>
                  <td className="py-2 pr-3">Remembers your light / dark / system choice</td>
                  <td className="py-2">Stored locally until you clear site data or change the setting</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
            You can clear cookies and local storage in your browser settings; clearing session cookies will sign you out. We do
            not use a consent banner because we do not set non-essential tracking cookies.
          </p>
        </Card>

        {/* Third parties */}
        <Card className="mt-4">
          <h2 className="text-base font-semibold text-on-surface">7. Third-party services & data processors</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant">
                  <th className="pb-2 pr-3 font-semibold">Service</th>
                  <th className="pb-2 pr-3 font-semibold">Purpose</th>
                  <th className="pb-2 font-semibold">Data shared</th>
                </tr>
              </thead>
              <tbody className="text-sm leading-relaxed text-on-surface-variant">
                <tr className="border-b border-outline-variant/20">
                  <td className="py-2 pr-3 font-medium text-on-surface">Supabase</td>
                  <td className="py-2 pr-3">Secure database and authentication</td>
                  <td className="py-2">Account and contribution data you provide</td>
                </tr>
                <tr className="border-b border-outline-variant/20">
                  <td className="py-2 pr-3 font-medium text-on-surface">Google / GitHub</td>
                  <td className="py-2 pr-3">Sign-in providers</td>
                  <td className="py-2">We receive your email, display name, and profile photo from the provider you choose</td>
                </tr>
                <tr className="border-b border-outline-variant/20">
                  <td className="py-2 pr-3 font-medium text-on-surface">Avatar image delivery</td>
                  <td className="py-2 pr-3">Displays your profile photo</td>
                  <td className="py-2">Your browser fetches the image directly from the provider; no additional personal data is sent by us</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-medium text-on-surface">Government & civic data sources</td>
                  <td className="py-2 pr-3">Live civic information (weather, infrastructure projects, earthquake advisories, map boundaries)</td>
                  <td className="py-2">Proxied securely through our servers — no personal data is forwarded; only general query parameters such as Lucena City coordinates</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
            We do not sell data to, or share data with, advertisers or data brokers. Third parties listed above act as
            processors only for the purpose described.
          </p>
        </Card>

        {/* Security & storage */}
        <Card className="mt-4">
          <h2 className="text-base font-semibold text-on-surface">8. Storage, retention & security</h2>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
            <li>
              • <span className="font-medium text-on-surface">Where stored:</span> Encrypted cloud database managed by our
              authentication and data provider. Access credentials are kept in server-only environment variables and never
              exposed to the browser or committed to source code.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Access control:</span> Strict role-based access — you can view all
              public profiles and update only your own; designated maintainers can moderate accounts only within their
              permission level, and every permission check also verifies that your account is approved and not restricted.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Additional safeguards:</span> Automated database rules prevent
              self-approval, privilege escalation, and unauthorized restriction or role changes — only authorized maintainers can
              perform those actions, and elevated changes require Head Maintainer authorization.
            </li>
            <li>
              • <span className="font-medium text-on-surface">In transit & at rest:</span> All connections use HTTPS; data is
              encrypted at rest by our provider; content fetched from external government sources is treated as untrusted input
              before display.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Retention:</span> Your account data is kept while your account
              exists; contributions and reports are retained for audit and provenance (the original discussion remains linked even
              after a correction). Guest report contact emails are kept with the report for follow-up. You may request deletion
              at any time — see §10.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Account deletion:</span> When your sign-in account is deleted,
              your profile and related personal data are removed automatically. Contact the Head Maintainer to request full
              erasure.
            </li>
          </ul>
        </Card>

        {/* Sharing & disclosure */}
        <Card className="mt-4">
          <h2 className="text-base font-semibold text-on-surface">9. Sharing & disclosure</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            We do <span className="font-medium text-on-surface">not sell</span> personal data. We disclose personal data only:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
            <li>• To Head Maintainers and assigned Validators on a strict need-to-know basis to review your submission.</li>
            <li>
              • With your <span className="font-medium text-on-surface">explicit consent</span> or under{" "}
              <span className="font-medium text-on-surface">lawful order</span> (e.g., if you pursue a harassment case under RA
              11313 and request records as evidence — disclosed per RA 10173 consent and legal-process requirements; see{" "}
              <a
                href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CODE_OF_CONDUCT.md#reporting-harassment--ra-11313-safe-spaces-act--anti-bastos-law--report"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Code of Conduct — Reporting Harassment
              </a>
              ).
            </li>
            <li>• To comply with applicable Philippine law or to respond to a valid government or National Privacy Commission request.</li>
          </ul>
          <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
            Volunteer validators never email you directly; all validator-to-source communication stays in the private on-site
            thread — as documented in{" "}
            <a
              href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CODE_OF_CONDUCT.md#privacy--username-email--public-credit"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Code of Conduct — Email use disclosure
            </a>
            .
          </p>
        </Card>

        {/* Your rights */}
        <Card className="mt-4">
          <h2 className="text-base font-semibold text-on-surface">10. Your rights under RA 10173</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            As a data subject you have the right to be informed, to access, to object, to erasure or blocking, to rectification,
            to data portability (where applicable), to be indemnified for damages, and to file a complaint with the National
            Privacy Commission (NPC).
          </p>
          <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
            <li>
              • <span className="font-medium text-on-surface">Access & rectification:</span> View and update your name,
              username, and privacy preferences anytime at{" "}
              <Link href="/user/settings" className="font-medium text-primary hover:underline">
                /user/settings
              </Link>
              .
            </li>
            <li>
              • <span className="font-medium text-on-surface">Withdraw opt-in:</span> Turn off public listing or profile photo
              visibility at any time — changes take effect immediately.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Erasure / blocking:</span> Request account and data deletion by
              emailing{" "}
              <a href="mailto:weryses19@gmail.com" className="font-medium text-primary hover:underline">
                weryses19@gmail.com
              </a>{" "}
              (include &quot;PRIVACY — Erasure request&quot; in the subject). Published civic data derived from official sources
              may be retained for transparency with attribution removed where appropriate.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Objection & restriction:</span> If your account is restricted, all
              permissions are denied until reviewed; you may appeal by contacting a Head Maintainer.
            </li>
            <li>
              • <span className="font-medium text-on-surface">Complaint:</span> you may lodge a complaint with the{" "}
              <a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                National Privacy Commission (privacy.gov.ph)
              </a>
              .
            </li>
          </ul>
        </Card>

        {/* Children */}
        <Card className="mt-4">
          <h2 className="text-base font-semibold text-on-surface">11. Children&apos;s privacy</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            This portal is intended for general civic use. We do not knowingly collect personal data from children. If you
            believe a minor has provided personal data, contact us to request removal.
          </p>
        </Card>

        {/* Changes */}
        <Card className="mt-4">
          <h2 className="text-base font-semibold text-on-surface">12. Changes to this policy</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            We may update this policy to reflect system changes or legal updates. Material changes will be noted by updating the
            &quot;Last updated&quot; date above and, where appropriate, via an announcement on{" "}
            <Link href="/announcements" className="font-medium text-primary hover:underline">
              /announcements
            </Link>
            . Continued use after an update constitutes acceptance of the revised policy.
          </p>
        </Card>

        {/* Contact + gov text */}
        <Card className="mt-4">
          <h2 className="text-base font-semibold text-on-surface">13. Contact & governing law</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            Questions about this policy or how to exercise your rights: contact privacy/security at{" "}
            <a href="mailto:weryses19@gmail.com" className="font-medium text-primary hover:underline">
              weryses19@gmail.com
            </a>{" "}
            (include &quot;PRIVACY&quot; in the subject). For harassment-related privacy concerns, you may also file privately at{" "}
            <Link href="/report" className="font-medium text-primary hover:underline">
              /report
            </Link>{" "}
            (visible only to Head Maintainers, with RA 11313 + RA 10173 confidentiality — see{" "}
            <a
              href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CODE_OF_CONDUCT.md#reporting-harassment--ra-11313-safe-spaces-act--anti-bastos-law--report"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Code of Conduct — Reporting Harassment
            </a>
            ).
          </p>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            This policy is governed by the laws of the Republic of the Philippines, including{" "}
            <span className="font-medium text-on-surface">RA 10173 (Data Privacy Act of 2012)</span> and its Implementing Rules
            and Regulations, and related issuances of the National Privacy Commission.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
            See also:{" "}
            <Link href="/contributors" className="font-medium text-primary hover:underline">
              /contributors
            </Link>{" "}
            (public credit by username only, opt-in/out) ·{" "}
            <Link href="/contribute" className="font-medium text-primary hover:underline">
              /contribute
            </Link>{" "}
            (role selection & private discussion model) ·{" "}
            <Link href="/sitemap" className="font-medium text-primary hover:underline">
              /sitemap
            </Link>{" "}
            ·{" "}
            <a
              href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CODE_OF_CONDUCT.md"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              GitHub: Code of Conduct
            </a>{" "}
            ·{" "}
            <a
              href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              GitHub: Contributing (roles, privacy & validation)
            </a>
          </p>
        </Card>

        {/* Related GitHub policies */}
        <Card className="mt-4 border-primary/10 bg-primary-container/10">
          <h2 className="text-sm font-semibold text-on-surface">Related GitHub policies — Code of Conduct & Contributors</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            The privacy practices above implement the community policies defined in the repository. For contributor-facing
            details, refer to:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
            <li>
              •{" "}
              <a
                href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CODE_OF_CONDUCT.md#privacy--username-email--public-credit"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                CODE_OF_CONDUCT.md — Privacy, Username & Public Credit
              </a>{" "}
              — username-only public credit, email never displayed, and private-report preference.
            </li>
            <li>
              •{" "}
              <a
                href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CODE_OF_CONDUCT.md#scope"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                CODE_OF_CONDUCT.md — Scope & Reporting
              </a>{" "}
              — where the code applies and how to use <span className="font-medium text-on-surface">/report</span> with proof
              for RA 11313 matters.
            </li>
            <li>
              •{" "}
              <a
                href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CONTRIBUTING.md#privacy--public-credit--username-and-email"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                CONTRIBUTING.md — Privacy & Public Credit
              </a>{" "}
              — opt-in/out for{" "}
              <Link href="/contributors" className="font-medium text-primary hover:underline">
                /contributors
              </Link>
              , email used only for Head Maintainer notifications.
            </li>
            <li>
              •{" "}
              <a
                href="https://github.com/RyannKim327/BetterLucenaCity/blob/main/CONTRIBUTING.md#user-management-restriction--role-governance-admin-vs-maintainer"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                CONTRIBUTING.md — User Management & Role Governance
              </a>{" "}
              — how pending approvals, restrictions, and role changes are verified for privacy.
            </li>
          </ul>
          <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
            The GitHub documents are the source of truth for community conduct and contribution workflow; this Privacy Policy
            is the source of truth for RA 10173 data processing. Where they overlap, both are enforced together.
          </p>
        </Card>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-on-surface-variant">
          For the authoritative legal source text, consult RA 10173 and issuances of the National Privacy Commission.
        </p>
      </section>
    </div>
  );
}
