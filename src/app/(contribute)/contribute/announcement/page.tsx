import { PageHeader } from "@/components/layout/page-header";
import { AnnouncementForm } from "@/components/contribute/announcement-form";
import { createClient } from "@/lib/supabase/server";

export default async function ContributingAnnouncement() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Announcement"
        title="Contribute · Announcement"
        description="Centered form — submit advisories, notices, and public updates. Factual, sourced, and non-partisan."
      />
      <AnnouncementForm userEmail={user.email ?? ""} />
    </div>
  );
}
