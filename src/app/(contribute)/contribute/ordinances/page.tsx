import { PageHeader } from "@/components/layout/page-header";
import { OrdinanceForm } from "@/components/contribute/ordinance-form";
import { createClient } from "@/lib/supabase/server";

export default async function ContributingOrdinances() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Ordinances"
        title="Contribute · Ordinances & Legal"
        description="Centered form — submit ordinances, resolutions, executive orders, and memoranda with references for validation."
      />
      <OrdinanceForm userEmail={user.email ?? ""} />
    </div>
  );
}
