import { PageHeader } from "@/components/layout/page-header";
import { ServicePanel } from "@/components/contribute/service-panel";
import { createClient } from "@/lib/supabase/server";

export default async function ContributingServices() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Services"
        title="Contribute · Services"
        description="Left: form to add or correct a service. Right: recent services list — you may add one anytime. Include office and source."
      />
      <ServicePanel userEmail={user.email ?? ""} />
    </div>
  );
}
