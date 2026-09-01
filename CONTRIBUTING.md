# Contributing Guide

Salamat sa pag-contribute! This guide covers everything you need to help build the BetterGov.ph portal for Lucena City — **whether you code or not.**

## About the Project

BetterLucenaCity is a community-driven platform that makes Lucena City's government information and public services more accessible, transparent, and easy to navigate.

> **Contributing is not just about code.** The backbone of this portal is trustworthy public information.
We need residents, students, researchers, and civil servants who can **gather, verify, validate, and share** data — just as much as developers who build features.
In the spirit of *bayanihan* and *malasakit*, every verified fact counts.

## Ways to Contribute

Anyone is welcome to contribute — no technical background required. Here are the main pathways:

### 1. Code
New features, bug fixes, performance improvements, and integrations with public APIs.

### 2. Data Gathering & Research
- Collect public information about LGU services, fees, office locations, hotlines, ordinances, and city programs.
- Identify public data sources worth integrating (national budget, DPWH projects, weather, disaster risk, etc.).
- Share local knowledge that can be cross-checked against official records.

### 3. Data Verification & Validation
- Double-check existing service details, hotline numbers, addresses, officials' names, and requirements against official sources.
- Flag outdated or incorrect information with the correct value **and its source**.
- Review community-submitted reports for accuracy before they are published.

### 4. Transparency Reports
- Submit reports, documents, or datasets related to Lucena City governance — e.g., budget allocations, project status, procurement notices, ordinances, program announcements.
- Help transcribe or summarize scanned ordinances, meeting minutes, and official notices into searchable content.
- Anyone may share a report — **it must be valid, come from a reliable source, and include supporting documents whenever possible** (see guidelines below).

### 5. Design
Accessibility audits, UI polish following our Material Design 3 system, and usability testing with real residents.

### 6. Content & Translation
Bilingual copy (English/Tagalog), documentation, proofreading, and plain-language summaries so information is understandable for everyone.

## Contributing Data & Reports (No Code Needed)

You don't need to fork the repo or write code to make an impact. Transparency grows when more eyes help keep information honest and up-to-date.

### How to share information

All data sharing happens **on the website itself** at **`/contribute`** (requires sign-in). **Please do not create a public GitHub Issue for data submissions** — the website's private discussion protects your privacy and prevents the mental-health strain of public scrutiny, harassment, or doxxing.

- **For small updates or reports:** Use `/contribute` and choose the appropriate category. Fill in title, details, source link, and attach or link supporting documents.
- **For larger datasets or ongoing research:** Use `/contribute` with category *Report / Document*. Large files are handled entirely in a **private platform discussion** (Source ↔ Validator ↔ Head Maintainer) before any publish — see workflow below. Do not post datasets as GitHub Issues.
- **For data corrections:** Use `/contribute` with category *Data Verification / Correction*. Corrections always trigger a **private three-way discussion** on the website between the Source (you), the Data Validators (at least three), and the Head Maintainer (administrator) so context and evidence stay contained and respectful.

> **Why not GitHub Issues for data?** GitHub Issues are public and indexable. Hosting sensitive corrections and datasets on the website keeps contributor identities and deliberations visible only to the Source, the Validator, and the Head Maintainer — preserving privacy, reducing anxiety from public call-outs, and keeping the focus on facts rather than personalities.

### What we require for every data/report contribution
1.  **Valid and reliable source** — the information must come from an origin we can verify. Preferred sources include:
    - Official LGU channels: `lucena.gov.ph`, City Hall postings, official Facebook pages of Lucena LGU offices
    - National government portals: DBM, DPWH, PSA, DILG, Comelec, Official Gazette
    - Published ordinances/resolutions, FOI responses, COA audit reports
    - Reputable news outlets *with* attribution to primary documents (secondary sources alone are not sufficient for publication without the primary reference)
2.  **Supporting documents whenever possible** — please link or describe attachments such as:
    - Direct URL to the ordinance, memo, advisory, PDF, or dataset
    - Photo/scan of the official posting (with date and venue visible)
    - Screenshot of the LGU bulletin or social media post (include the post URL)
    - Document reference number, date issued, and issuing office
    > If you cannot share the file directly, tell us *how* we can obtain or verify it. Submissions without any verifiable reference will be held for review and not published until validated.

3.  **Factual, non-partisan, and privacy-respecting** — no campaign material or endorsements, no personal opinions, no sensitive personal data (IDs, private addresses, contact numbers of private citizens). Redact private details before submitting.

### What happens after you submit?

**For routine reports** (e.g., a single announcement or hotline update), a **Data Validator** reviews the source + supporting document, cross-references with existing records, and — if valid — publishes with attribution (source name + URL). If more proof is needed we follow up via the contribution thread. Accuracy over speed.

**For data corrections and larger datasets — three-way discussion on the platform:**

Larger or higher-risk contributions (correcting already-published data, multi-row datasets, budget tables, or collections of scanned ordinances) are **never approved one-way**. The website itself hosts a **transparent discussion between three parties**:

1.  **Source (you, the submitter)** — who provided the data, the reliable source, and the supporting documents.
2.  **Data Validator** — who has research knowledge to trace primary sources, check reference numbers/seals/dates, and cross-reference to prevent false information. Validators must be strictly non-partisan and must not cherry-pick data by political party.
3.  **Head Maintainer (website administrator)** — the final arbiter who moderates the discussion, enforces data-accuracy and non-partisan rules, and approves publication or rejection.

**Workflow:**
1. You submit via `/contribute` on the website (even for very large files — use the supporting-document link field for drive/portal URLs). The submission becomes a **private discussion thread visible only to you, the Validators, and the Head Maintainer** — not a public GitHub Issue.
2. A Data Validator is assigned, checks authenticity, currency, and completeness, and posts questions or requests for additional supporting documents **directly in that private thread**.
3. You (the Source) reply in the same thread — clarifying context, adding a clearer photo, reference number, or primary URL. The discussion stays on-platform for auditability and privacy.
4. The Validator posts a recommendation (approve / request revision / reject with reason) in-thread after cross-checking.
5. The **Head Maintainer reviews the full private thread** — source evidence + validator analysis — and makes the final decision: publish (with attribution), return for revision, or reject (with a written, non-partisan justification). All decisions and attachments remain linked from the thread for future corrections, still without exposing the thread as a public issue.

> This three-way, **website-private** model prevents quiet edits, protects against false information, **protects contributor privacy, and shields contributors from the mental-health impacts of public shaming or political pile-ons**, while ensuring no single party or preference decides what gets published. Even after publication, anyone may open a **private correction discussion** under the same model — the original thread stays linked as provenance without ever becoming a public GitHub Issue.

> **Tip for students & researchers:** Even one verified correction — e.g., confirming a hotline's operating hours with a photo of the office signage and the city website link — is a meaningful contribution and will be credited.

### Create an account — Data Gathering & Validator roles

Everyone starts by **registering / signing in** at [`/contribute`](/contribute) (Google or GitHub via Supabase Auth). On first sign-in a profile row is created in `users`. You can then request a community role:

- **Data Collaborator** — for residents who regularly gather public information, submit reports, or transcribe ordinances. No formal credentials needed; reliability and accurate sourcing are the only requirements.
- **Data Validator** — for members who **review and approve** community submissions before publication. Because validators are gatekeepers against false information, they must meet higher criteria:

> **Data Validator requirements — please read before requesting the role:**
> 1. **Research literacy** — know how to trace a primary source, check document authenticity (reference number, issuing office, date, seal/signature), cross-reference across at least two independent sources, and spot AI-generated or altered documents. You should be comfortable with FOI requests, COA/DBM/DPWH portals, and the Official Gazette/LGU bulletin workflow.
> 2. **Fact-checking discipline** — verify currency (is the ordinance still in force?), completeness (are fees/pages missing?), and context (does the memo apply city-wide?). Never approve based on a headline, cropped screenshot, or secondary summary alone — ask for the full supporting document.
> 3. **Strictly non-partisan** — validators must **not be politically biased and must not selectively curate information to favor or disfavor any political party, family, or candidate.** All verifiable, public-interest reports are treated equally, whether they praise or criticize the current administration. Hiding, cherry-picking, or spinning data by party is grounds for removal.
> 4. **No conflicts of interest** — disclose any affiliation with an LGU office, contractor, or campaign. If you authored or are the subject of a report, recuse yourself from validating it.
> 5. **Commitment to correction** — validators must be willing to revert a published entry when new primary evidence shows it was wrong, with a transparent correction note.

To request a role, sign in, then **message a Maintainer or the Head Maintainer via the website contact / private discussion** with: (a) which role you want, and (b) a short note on your research experience. For privacy and to avoid public pressure, please do not request data-related roles via a public GitHub Issue. Maintainers assign roles via the `user_type` enum (`Data Collaborator`, `Data Validator`, `Tester`, `Maintainer`, `Head Maintainer`). Roles can be expanded as the community grows.

### Privacy & Public Credit — Username and Email

- **We use `username` for privacy.** Inside the app and in any public credit, you are identified by your chosen `username` (from `users.username`), not your legal name. This limits exposure while still letting the community give credit.
- **Public credit is opt-in/opt-out.** When your contribution is validated and published, you may choose whether your `username` appears publicly on **`/contributors`** to acknowledge those who help maintain the platform. If you prefer not to be listed, you can remain private — your contribution still counts, but only the Head Maintainer and assigned Validator see your identity in the private thread. You can change this preference from your profile.
- **Email is never public.** The email you sign in with is **not displayed anywhere** (not on `/contributors`, not in threads, not to validators). It is used **only to send system notifications** about your submissions (e.g., “received,” “needs more documents,” “published”) **via the Head Maintainer’s email account**. As of now, only the Head Maintainer’s account sends these notifications — **validators do not email contributors directly**; all validator-to-source communication stays in the private on-website discussion. No marketing or unrelated emails are sent.

### Reporting Harassment — RA 11313 (Anti-Bastos Law) via `/report`

This project enforces **RA 11313 (Safe Spaces Act / Anti-Bastos Law)** and our [Code of Conduct](CODE_OF_CONDUCT.md). We **must not disgrace, demean, or judge people** for who they are — regardless of gender, identity, appearance, beliefs, or background. Everyone must work **professionally and ethically**.

**If you feel harassed by another contributor (including a validator or maintainer):**
- **Do not post a public GitHub Issue.** Instead, file a report via the website at **`/report`** (available from the header/help links while signed in).
- **Include screenshot or proof** (image, thread export, link, timestamp) of the harassment so it can be investigated fairly. Reports without evidence are still received but may take longer to resolve.
- Your report is **private** — visible only to Head Maintainers / Project Administrators acting as investigators, not to the public or to the accused.

**Investigation & ethics:**
- Head Maintainers and Project Administrators **must be non-biased** and **investigate before judging**. We review the private thread, evidence, and statements from both sides without favoring any political party, seniority, or validator status.
- We uphold professional, ethical conduct and respect the privacy and dignity of both reporter and respondent.

**Consequences & legal use:**
- Depending on findings, sanctions range from warning to **disqualification from the contributor role or permanent ban from the system** (see Code of Conduct *Enforcement Guidelines*).
- If you wish to pursue a legal case under RA 11313, the platform **may provide the report and relevant private thread records as evidence** with proper consent/legal process. This is disclosed for transparency.
- Retaliation for good-faith reporting is itself a violation.

This reporting duty is part of both the **Code of Conduct** and **Contribution Policy**.

## Getting Started

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/BetterLucenaCity.git
   cd BetterLucenaCity
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Before opening a pull request, verify your changes:

   ```bash
   npm run lint
   npm run build
   ```

## Project Structure

```
src/
  app/                      # Next.js App Router pages and API routes
    api/                    # Route handlers proxying external data sources
      budget/national/
      contribute/
      dpwh/projects/
      earthquakes/
      geography/boundary/
      legal/documents/
      weather/
    auth/callback/          # Supabase auth callback
    announcements/          # Announcements page
    contact/                # Contact page
    contribute/             # Contributor form page
    contributors/           # Contributors listing page
    legal/                  # Legal documents / ordinances page
    services/               # Services directory page
    transparency/           # Transparency dashboard page
    layout.tsx              # Root layout
    page.tsx                # Home page
    globals.css             # Tailwind + design tokens
    middleware.ts           # Auth/session middleware
  components/
    layout/                 # Header, footer, hotlines, page headers
    live/                   # Live civic data client components
    map/                    # Leaflet map components
    sections/               # Home page sections (hero, about, services, etc.)
    theme/                  # Theme provider + toggle
    transparency/           # National budget section
    ui/                     # Reusable primitives (Card, Button)
  lib/
    data/                   # Local site content and sample data
    sources/                # Server-side clients for external APIs
    supabase/               # Supabase client/server helpers
    cache.ts                # Revalidation cache helpers
    functions.ts            # Shared utilities
  types/                    # TypeScript type declarations
public/
  better-lucena-city.png    # Brand logo
  better-lucena-city.svg
  lucena-seal.svg           # Official city seal
  lucena-land-logo.svg
supabase/
  migrations/               # SQL schema migrations
```

## Ground Rules

### Code Style

- Server Components by default; use Client Components only when interactivity requires it
- No heavy component libraries — prefer composable Tailwind utilities
- Use the design tokens in `src/app/globals.css` (colors, elevation shadows) instead of hardcoding values
- TypeScript strict mode must pass; no `any`

### Data Accuracy & Transparency

This is a government-facing project, so **accuracy and verifiability matter above all:**

- **Never invent official data.** Hotlines, addresses, officials' names, fees, and budget figures must come from verified sources. Use clearly marked placeholders when real values are unavailable.
- **Cite sources and keep supporting documents.** Every data edit or report must list its source name and URL. Link the primary document (PDF, ordinance, LGU post, dataset) or describe where it can be verified. If you gathered data in person (e.g., photographed a bulletin board), include the photo, date, and location.
- **Verify before you publish.** Cross-check against at least one official or primary source. If you are *validating* someone else's submission, confirm the document authenticity (reference number, issuing office, date) before approving.
- **Attribute upstream feeds.** When adding external data integrations, include the source name and attribution URL in the response payload.
- **Cache responsibly.** Upstream fetches should use `next: { revalidate }` so we don't hammer public government APIs.

### Civic Values

- **Non-partisan and unbiased validation:** no campaign material, no endorsements, and **no selective reporting by political party.** Validators in particular must publish all verifiable public-interest data equally — we never suppress a valid report because it reflects poorly (or well) on a party, nor prioritize data that benefits one. See *Data Validator requirements* above.
- Accessible: semantic HTML, keyboard navigation, sufficient contrast
- Bilingual-friendly: English and Filipino are both welcome in UI copy
- **Research-first:** especially for validators, prevention of false information comes before speed. When in doubt, ask for another source — don't guess.

## Submitting Changes

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Commit with a clear message describing *what* and *why*
3. **Run the test suite before pushing:**

   ```bash
   npm run gh-test
   ```

   `gh-test` runs `eslint` followed by `next build`. **You must not push if it reports any errors.** Fix all failures before proceeding.
4. Push to your fork and open a Pull Request against `main`
5. Describe what changed and how to test it; link any related issues

## Reporting Issues & Data Inaccuracies

When filing a bug, please include:

- What you expected vs. what happened
- Steps to reproduce
- Screenshots if visual

**For data inaccuracies or transparency reports, please include:**

- The correct value and **its reliable source** (URL or document reference)
- **Supporting documents** — link to the PDF, ordinance, LGU Facebook post, FOI response, or attach a photo/scan (with date and office/seal visible)
- Document metadata if available: reference number, date issued, issuing office
- How you verified it (e.g., "Visited City Hall on 2026-08-28, confirmed with Business Permits Office")

No supporting document? Tell us how we can verify your report — submissions without any verifiable reference will be reviewed but not published until validated. See [`/contribute`](/contribute) for the guided submission form — anyone is welcome to share a valid report. **Please use this website form, not a public GitHub Issue, for data reports** to keep the conversation private.

> **Corrections & large datasets:** these automatically open a **private three-way discussion on the website** (not a GitHub Issue) between the Source (you), the Data Validators, and the Head Maintainer (administrator). All questions, extra supporting documents, and the final publish/reject decision stay in that private thread — protecting your privacy and well-being while preserving transparency for the decision.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see [LICENSE.md](LICENSE.md)).
