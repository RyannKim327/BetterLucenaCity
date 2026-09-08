import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import CheckPermission from "@/lib/roles";
import { report_types } from "@/lib/report-types";
import { ReportTabs, ReportTabKey } from "@/components/report/report-tabs";
import { ReportForm } from "@/components/report/report-form";
import { ReportList, ReportRow } from "@/components/report/report-list";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  searchParams?: Promise<{ tab?: string }>;
}

export default async function ReportPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  let canSeeAll = false;
  if (isAuthenticated && user) {
    try {
      canSeeAll = await CheckPermission(user.id, "maintainer");
    } catch {
      canSeeAll = false;
    }
    // also allow admin explicitly (redundant via ALL but keep)
    if (!canSeeAll) {
      try {
        canSeeAll = await CheckPermission(user.id, "admin");
      } catch {
        canSeeAll = false;
      }
    }
  }

  const sp = searchParams ? await searchParams : {};
  const rawTab = (sp.tab ?? "all").toLowerCase();
  const allowed: ReportTabKey[] = ["all", "pending", "done"];
  const tab: ReportTabKey = (allowed as string[]).includes(rawTab) ? (rawTab as ReportTabKey) : "all";

  let rowsAll: ReportRow[] = [];
  let fetchError: string | null = null;

  if (isAuthenticated && user) {
    // Build query — maintainers/admins see all, others see own
    let query = supabase.from("report").select("id, user_id, title, content, type, report_source, unauth_email, done");
    if (!canSeeAll) {
      query = query.eq("user_id", user.id);
    }
    // Try ordering by id; table has no date column — id (uuid) ordering is arbitrary but stable.
    // If RLS or missing table, handle error gracefully.
    const { data, error } = await query;
    if (error) {
      fetchError = error.message;
    } else {
      rowsAll = (data ?? []) as ReportRow[];
    }
  }

  const counts = {
    all: rowsAll.length,
    pending: rowsAll.filter((r) => r.done !== true).length,
    done: rowsAll.filter((r) => r.done === true).length,
  };

  const rows = rowsAll.filter((r) => {
    if (tab === "all") return true;
    if (tab === "pending") return r.done !== true;
    if (tab === "done") return r.done === true;
    return true;
  });

  const publicTypes = Object.entries(report_types).filter(([, v]) => v.public);
  const privateTypes = Object.entries(report_types).filter(([, v]) => !v.public);

  return (
    <div>
      <PageHeader
        eyebrow="Kaligtasan · Safe Spaces"
        title="Report center"
        description="File a report or track your submissions. Public types (Data Misinformation, Security Concerns) are available to everyone — including guests. System Vulnerability, Racism, and Personal Bias reports require sign-in. Head Maintainers and Maintainers can review all reports; contributors see only their own."
      />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.7fr_0.95fr]">
        {/* LEFT — list with tabs */}
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">{canSeeAll ? "All reports" : isAuthenticated ? "Your reports" : "Reports"}</h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-on-surface-variant">
                  {canSeeAll
                    ? "You have maintainer access — you can see every report (including guest submissions) and mark them as pending or done."
                    : isAuthenticated
                      ? "You see only the reports you created. Maintainers can see all reports."
                      : "Sign in to file private reports and to track the reports you submit. Guests can file public reports but cannot browse lists."}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${canSeeAll ? "bg-primary-container text-on-primary-container" : "bg-surface-container text-on-surface-variant"}`}>
                {canSeeAll ? "Maintainer view" : isAuthenticated ? "Contributor view" : "Guest view"}
              </span>
            </div>

            {!isAuthenticated ? (
              <div className="mt-6 rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-4">
                <p className="text-sm font-medium">Sign in to track reports</p>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                  Guests can still file <span className="font-medium text-on-surface">public</span> reports below (Data Misinformation, Security Concerns) but lists are hidden.{" "}
                  After signing in you can file all five types and see Pending / Done tabs for your own reports.
                </p>
                <p className="mt-3 text-xs text-on-surface-variant">
                  Public types: {publicTypes.map(([, v]) => v.name).join(", ")} · Authenticated-only: {privateTypes.map(([, v]) => v.name).join(", ")}
                </p>
                <Link href="/contribute" className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary/90">
                  Sign in / Contribute
                </Link>
              </div>
            ) : fetchError ? (
              <div className="mt-6 rounded-xl border border-secondary/30 bg-secondary-container/30 px-4 py-3">
                <p className="text-sm font-medium text-on-secondary-container">Failed to load reports</p>
                <p className="mt-1 text-xs leading-relaxed text-on-secondary-container">{fetchError}</p>
                <p className="mt-2 text-xs text-on-secondary-container">If the report table has not been migrated yet, this view will be empty until data exists.</p>
              </div>
            ) : (
              <div className="mt-6">
                <ReportTabs counts={counts} current={tab} />
                <ReportList reports={rows} canSeeAll={canSeeAll} currentTab={tab} />

                <div className="mt-6 rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3">
                  <h3 className="text-sm font-semibold">How visibility works</h3>
                  <ul className="mt-2 space-y-1 text-xs leading-relaxed text-on-surface-variant">
                    <li>• <span className="font-medium text-on-surface">Maintainers & Head Maintainers</span> — see all reports (user + guest), use Pending/Done to triage.</li>
                    <li>• <span className="font-medium text-on-surface">Data Collaborator / Data Validator / Tester</span> — see only reports where <code className="rounded bg-surface-container-low px-1 py-0.5">user_id = you</code>; pending = <code>done = false</code>, done = <code>done = true</code>.</li>
                    <li>• <span className="font-medium text-on-surface">Guests</span> — can submit only <code>public: true</code> types ({publicTypes.map(([k]) => k).join(", ")}); no list access.</li>
                  </ul>
                </div>
              </div>
            )}
          </Card>

          {/* Legal / handling — kept from original but compact */}
          <Card>
            <h3 className="text-sm font-semibold">How we handle it</h3>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-on-surface-variant">
              <li>• Head Maintainers / Project Administrators investigate — <span className="font-medium text-on-surface">non-biased, investigate before judging</span>, no favor to any party.</li>
              <li>• We do not disgrace or judge people for who they are — we work <span className="font-medium text-on-surface">professionally and ethically</span>.</li>
              <li>• Both reporter and respondent privacy is respected during review.</li>
            </ul>

            <h3 className="mt-6 text-sm font-semibold">Legal basis</h3>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
              <li>• <span className="font-medium text-on-surface">RA 10173 — Data Privacy Act</span>: personal data is confidential; shared only with investigators on need-to-know.</li>
              <li>• <span className="font-medium text-on-surface">RA 11313 — Safe Spaces Act (Bawal Bastos)</span>: penalizes gender-based harassment online/offline.</li>
              <li>• <span className="font-medium text-on-surface">RA 7877 / RA 9710 / RA 9262</span>: work & gender protections.</li>
              <li>• <span className="font-medium text-on-surface">RA 7277/10524, RA 10911, RA 11166 & Art. XIII Sec.1, 1987 Constitution</span>: anti-discrimination.</li>
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
              Consequences range from warning to ban. With <span className="font-medium text-on-surface">explicit consent</span> and lawful process, records may be provided as evidence under RA 10173.
            </p>
          </Card>
        </div>

        {/* RIGHT — form + info */}
        <div className="space-y-6">
          <ReportForm isAuthenticated={isAuthenticated} />

          <Card>
            <h3 className="text-sm font-semibold">Privacy — RA 10173 compliance</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              You are credited by <span className="font-medium text-on-surface">username only</span>. Opt in/out on <Link href="/contributors" className="font-medium text-primary hover:underline">/contributors</Link>.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Your email is <span className="font-medium text-on-surface">never displayed</span> and used only for system notifications via the Head Maintainer&apos;s account.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
              We follow data minimization and confidentiality — collect only what is needed, retain only as long as necessary, disclose only with consent or lawful order.
            </p>
          </Card>

          <Card className="border-primary/20 bg-primary-container/20">
            <h3 className="text-sm font-semibold">Your well-being matters</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Report threads are private — never a public GitHub Issue — to protect identity and mental health from public shaming. Do not use public issues for harassment reports.
            </p>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold">Fallback contact</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              If the form is unavailable, email{" "}
              <a href="mailto:weryses19@gmail.com" className="font-medium text-primary hover:underline">
                weryses19@gmail.com
              </a>{" "}
              with subject <code className="rounded bg-surface-container px-1 py-0.5 text-xs">[REPORT] RA — your username</code> and attach proof.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">See also <Link href="/contribute" className="font-medium text-primary hover:underline">CONTRIBUTING</Link> and <Link href="/contributors" className="font-medium text-primary hover:underline">CODE OF CONDUCT</Link>.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
