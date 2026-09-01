import { PageHeader } from "@/components/layout/page-header";
import { ContactPanel } from "@/components/contribute/contact-panel";
import { createClient } from "@/lib/supabase/server";

export default async function ContributingContact() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Contacts"
        title="Contribute · Contacts"
        description="Left: form to add or correct a hotline. Right: recent contacts list — you may add one anytime. Every entry needs a reliable source."
      />
      <ContactPanel userEmail={user.email ?? ""} />
    </div>
  );
}
