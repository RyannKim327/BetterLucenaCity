"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react";

type UserProfile = {
  first_name: string | null;
  last_name: string | null;
  username: string;
  show_contributor: boolean | null;
  show_picture: boolean | null;
};

export function SettingsForm({ initial }: { initial: UserProfile }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(initial.first_name ?? "");
  const [lastName, setLastName] = useState(initial.last_name ?? "");
  const [username, setUsername] = useState(initial.username ?? "");
  const [showContributor, setShowContributor] = useState(!!initial.show_contributor);
  const [showPicture, setShowPicture] = useState(!!initial.show_picture);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dirty =
    firstName !== (initial.first_name ?? "") ||
    lastName !== (initial.last_name ?? "") ||
    username !== (initial.username ?? "") ||
    showContributor !== !!initial.show_contributor ||
    showPicture !== !!initial.show_picture;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        username: username.trim(),
        show_contributor: showContributor,
        show_picture: showPicture,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Failed to save. Please try again.");
      setSaving(false);
      return;
    }

    setSuccess("Settings saved.");
    setSaving(false);
    router.refresh();
    // Update initial reference by reloading; keep success message visible
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-card border border-outline-variant/40 bg-surface-container-low p-6 shadow-elevation-1">
        <h2 className="text-base font-semibold text-on-surface">Personal information</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Update your display name and username. Changes are reflected on your public profile when visibility is enabled.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="first_name" className="text-sm font-medium text-on-surface">
              First name
            </label>
            <input
              id="first_name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Juan"
              maxLength={50}
              className="w-full rounded-xl border border-outline-variant bg-background px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="last_name" className="text-sm font-medium text-on-surface">
              Last name
            </label>
            <input
              id="last_name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Dela Cruz"
              maxLength={50}
              className="w-full rounded-xl border border-outline-variant bg-background px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="username" className="text-sm font-medium text-on-surface">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="juan_delacruz"
              minLength={3}
              maxLength={24}
              required
              className="w-full rounded-xl border border-outline-variant bg-background px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-xs text-on-surface-variant">
              3–24 characters. Letters, numbers, dot, underscore, or hyphen. Must be unique.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-outline-variant/40 bg-surface-container-low p-6 shadow-elevation-1">
        <h2 className="text-base font-semibold text-on-surface">Privacy & visibility</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Control how your contributor presence appears to the public.
        </p>

        <div className="mt-6 space-y-5">
          <label className="flex items-start gap-3 rounded-xl border border-outline-variant/40 bg-background p-4 hover:bg-surface-container transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={showContributor}
              onChange={(e) => setShowContributor(e.target.checked)}
              className="mt-0.5 size-5 rounded border-outline-variant text-primary focus:ring-primary/20"
            />
            <span className="flex-1">
              <span className="block text-sm font-medium text-on-surface">Show to public</span>
              <span className="block text-xs leading-relaxed text-on-surface-variant">
                When enabled, your username and role appear on the public contributors list at <span className="font-medium">/contributors</span>. Pending contributors are hidden until approved regardless of this setting.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-outline-variant/40 bg-background p-4 hover:bg-surface-container transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={showPicture}
              onChange={(e) => setShowPicture(e.target.checked)}
              className="mt-0.5 size-5 rounded border-outline-variant text-primary focus:ring-primary/20"
            />
            <span className="flex-1">
              <span className="block text-sm font-medium text-on-surface">Public profile photo</span>
              <span className="block text-xs leading-relaxed text-on-surface-variant">
                When enabled, your avatar is shown alongside your contributor card. Otherwise a placeholder is displayed.
              </span>
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-200">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden />
          <span>{success}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || !dirty || !username.trim()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-on-primary shadow-elevation-1 transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Save size={18} aria-hidden />}
          {saving ? "Saving..." : "Save changes"}
        </button>
        <p className="text-xs text-on-surface-variant">
          {dirty ? "You have unsaved changes." : "All changes saved."}
        </p>
      </div>
    </form>
  );
}
