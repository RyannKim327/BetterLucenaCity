import { PageHeader } from "@/components/layout/page-header";
import { allRoles, roles } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { User, Mail, Shield, Calendar, Eye, EyeOff, Image as ImageIcon, Settings } from "lucide-react";

export default async function UserInformation() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("first_name, last_name, username, email, avatar_url, user_type, approved, show_contributor, show_picture, date_added")
    .eq("id", user?.id)
    .maybeSingle();

  const rawType = profile?.user_type ?? "";
  const key = rawType.trim().replace(/\s/gi, "_").toLowerCase();
  let role: string[] = roles[key] ?? [];
  if (role[0] === "ALL") role = [...allRoles];

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || profile?.username || user?.email?.split("@")[0] || "User";

  return (
    <div>
      <PageHeader
        title="User Profile"
        description="View your account information and visibility preferences. Edit details in Settings."
      />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Profile overview card */}
        <div className="rounded-card border border-outline-variant/40 bg-surface-container-low p-6 shadow-elevation-1 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-container text-on-primary-container sm:size-24">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={displayName} className="size-full object-cover" />
              ) : (
                <User size={36} strokeWidth={1.6} aria-hidden />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-on-surface">{displayName}</h2>
              <p className="mt-1 text-sm text-on-surface-variant">@{profile?.username ?? "—"}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-on-surface-variant">
                <Mail size={14} aria-hidden />
                {profile?.email ?? user?.email ?? "—"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-container px-3 py-1 text-xs font-medium text-on-primary-container">
                  <Shield size={12} aria-hidden />
                  {profile?.user_type ?? "No role"}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${profile?.approved ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"}`}
                >
                  {profile?.approved ? "Approved" : "Pending approval"}
                </span>
                {profile?.date_added && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 text-xs text-on-surface-variant">
                    <Calendar size={12} aria-hidden />
                    Since {new Date(profile.date_added).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-background px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">First name</p>
                  <p className="mt-1 text-on-surface">{profile?.first_name || <span className="text-on-surface-variant">—</span>}</p>
                </div>
                <div className="rounded-xl bg-background px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Last name</p>
                  <p className="mt-1 text-on-surface">{profile?.last_name || <span className="text-on-surface-variant">—</span>}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 ${profile?.show_contributor ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-200" : "border-outline-variant/40 bg-surface-container-high text-on-surface-variant"}`}
                >
                  {profile?.show_contributor ? <Eye size={12} aria-hidden /> : <EyeOff size={12} aria-hidden />}
                  Show to public: {profile?.show_contributor ? "On" : "Off"}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 ${profile?.show_picture ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-200" : "border-outline-variant/40 bg-surface-container-high text-on-surface-variant"}`}
                >
                  <ImageIcon size={12} aria-hidden />
                  Public profile photo: {profile?.show_picture ? "On" : "Off"}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/user/settings"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-on-primary shadow-elevation-1 hover:bg-primary/90"
                >
                  <Settings size={16} aria-hidden />
                  Edit in Settings
                </Link>
                <Link
                  href="/contributors"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-outline bg-background px-5 text-sm font-medium text-on-surface hover:bg-surface-container"
                >
                  View public profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
