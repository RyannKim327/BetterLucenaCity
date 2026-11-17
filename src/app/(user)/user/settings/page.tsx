import { PageHeader } from "@/components/layout/page-header";
import { SettingsForm } from "@/components/user/settings-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function UserSettings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("first_name, last_name, username, show_contributor, show_picture, notify_announcements, notify_discussions, notify_reports, notify_email, notify_push")
    .eq("id", user?.id)
    .maybeSingle();

  const initial = {
    first_name: profile?.first_name ?? null,
    last_name: profile?.last_name ?? null,
    username: profile?.username ?? "",
    show_contributor: profile?.show_contributor ?? false,
    show_picture: profile?.show_picture ?? false,
    notify_announcements: profile?.notify_announcements ?? false,
    notify_discussions: profile?.notify_discussions ?? false,
    notify_reports: profile?.notify_reports ?? false,
    notify_email: profile?.notify_email ?? true,
    notify_push: profile?.notify_push ?? false,
  };

  return (
    <div>
      <PageHeader
        title="User Settings"
        description="Update your first name, last name, username, and visibility preferences."
      />

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href="/user"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface mb-6"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to Profile
        </Link>

        <SettingsForm initial={initial} />
      </section>
    </div>
  );
}
