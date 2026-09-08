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
    .select("first_name, last_name, username, show_contributor, show_picture")
    .eq("id", user?.id)
    .maybeSingle();

  const initial = {
    first_name: profile?.first_name ?? null,
    last_name: profile?.last_name ?? null,
    username: profile?.username ?? "",
    show_contributor: profile?.show_contributor ?? false,
    show_picture: profile?.show_picture ?? false,
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
