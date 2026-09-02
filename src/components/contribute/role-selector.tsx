"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { SELF_SELECT_ROLES } from "@/lib/role-options";
import { ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";

type Props = {
  email?: string;
  displayName?: string;
};

const ROLE_META: Record<string, { description: string; note: string }> = {
  "Maintainer": {
    description: "Serves as the right hand of the Head Maintainers where they monitor the behavior of the users and the platform. They also have the access through the code by collaboration in GitHub",
    note: "At least know how to code and follows the standards in code of conduct"
  },
  "Data Collaborator": {
    description: "Regularly gather and submit public reports — hotlines, services, ordinances, datasets.",
    note: "No formal credentials needed; reliability and strictly non-partisan gathering are what matter — submit all verifiable data equally, no cherry-picking by party.",
  },
  "Data Validator": {
    description: "Review and validate submissions before publication.",
    note: "Requires research knowledge & strictly non-partisan stance.",
  },
  "Tester": {
    description: "Help test features and report bugs or data issues.",
    note: "Good for early contributors getting familiar with the platform. Also have knowledge with cybersecurity related or ethical hacking.",
  },
};

export function RoleSelector({ email, displayName }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit() {
    if (!selected) {
      setError("Please choose a role first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selected }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to set role.");
        return;
      }
      setSuccess(true);
      // refresh server components to re-evaluate approved state -> will show pending UI
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="border-primary/20 bg-primary-container/20">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-on-surface">Role requested — pending approval</h3>
            <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
              You chose <span className="font-medium text-on-surface">{selected}</span> and your account is now. A Maintainer or Head Maintainer
              will review your request. You&apos;ll be able to contribute once approved.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
              Signed in as {displayName ? `${displayName} · ` : ""}{email ?? ""}. Refresh to check status.
            </p>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-on-primary hover:bg-primary/90"
            >
              Check again
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <h2 className="text-base font-semibold">Choose a role to continue</h2>
          <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
            Your account has no role yet. Pick the role you want — your request will be stored as (pending) until a Maintainer approves you.
          </p>
          {email && (
            <p className="mt-2 text-xs text-on-surface-variant">
              Signed in as {displayName ? `${displayName} · ` : ""}{email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {SELF_SELECT_ROLES.map((role) => {
          const meta = ROLE_META[role] ?? { description: "", note: "" };
          const active = selected === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => setSelected(role)}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${active
                ? "border-primary bg-primary-container/30 ring-1 ring-primary/20"
                : "border-outline-variant/40 bg-surface-container hover:bg-surface-container-high"
                }`}
            >
              <span className="flex items-center gap-2">
                <span className={`size-4 rounded-full border-2 flex items-center justify-center ${active ? "border-primary" : "border-outline-variant"}`}>
                  {active && <span className="size-2 rounded-full bg-primary" />}
                </span>
                <span className="text-sm font-semibold text-on-surface">{role}</span>
                {role === "Data Validator" && (
                  <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-medium text-on-secondary-container">research required</span>
                )}
                {role === "Data Collaborator" && (
                  <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-medium text-on-secondary-container">non-partisan</span>
                )}
              </span>
              <span className="mt-1.5 block text-sm leading-relaxed text-on-surface-variant">{meta.description}</span>
              <span className="mt-1 block text-xs leading-relaxed text-on-surface-variant/80">{meta.note}</span>
            </button>
          );
        })}
      </div>

      {selected === "Data Collaborator" && (
        <div className="mt-4 rounded-xl border border-secondary/20 bg-secondary-container/20 px-4 py-3 text-xs leading-relaxed text-on-surface-variant">
          <p className="font-medium text-on-surface">Data Collaborator — non-partisan gathering:</p>
          <ul className="mt-1 list-disc pl-4">
            <li>Strictly non-partisan — gather and submit all verifiable public-interest data equally, whether it praises or criticizes any party/family/candidate. No cherry-picking, hiding, or spinning.</li>
            <li>Reliability over affiliation — cite primary sources (ordinance, DBM/DPWH/PSA/DILG, lucena.gov.ph) and include supporting documents.</li>
          </ul>
        </div>
      )}

      {selected === "Data Validator" && (
        <div className="mt-4 rounded-xl border border-secondary/20 bg-secondary-container/20 px-4 py-3 text-xs leading-relaxed text-on-surface-variant">
          <p className="font-medium text-on-surface">Data Validator requirements:</p>
          <ul className="mt-1 list-disc pl-4">
            <li>Research knowledge — trace primary sources, check reference no./seal/date.</li>
            <li>Strictly non-partisan — cannot cherry-pick data to favor any party or candidate.</li>
          </ul>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={loading || !selected}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Requesting…" : `Request ${selected ?? "role"}`}
        </button>
      </div>
    </Card>
  );
}

export function PendingApproval({ role, email }: { role: string | null; email?: string }) {
  const router = useRouter();
  return (
    <Card className="border-warning/20 bg-surface-container">
      <div className="flex items-start gap-3">
        <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-secondary" />
        <div>
          <h2 className="text-base font-semibold">Pending approval</h2>
          <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
            You requested <span className="font-medium text-on-surface">{role ?? "a role"}</span> — your account is currently{" "}
            <span className="font-medium text-on-surface">not approved</span>. A Maintainer will review who the contributors are and approve valid requests.
          </p>
          {email && <p className="mt-2 text-xs text-on-surface-variant">Signed in as {email}</p>}
          <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
            Need to change your requested role? You can pick again below (you stay pending until re-approved).
          </p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="mt-4 inline-flex h-9 items-center justify-center rounded-full border border-outline bg-surface-container-low px-5 text-sm font-medium text-on-surface hover:bg-surface-container"
          >
            Refresh status
          </button>
        </div>
      </div>
    </Card>
  );
}
