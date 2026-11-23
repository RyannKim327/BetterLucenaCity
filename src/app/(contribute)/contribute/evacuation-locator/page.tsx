import { PageHeader } from "@/components/layout/page-header";
import { EvacuationLocatorForm } from "@/components/contribute/evacuation-locator-form";
import { getEvacuationCenters } from "@/lib/data/evacuation-centers";
import { createClient } from "@/lib/supabase/server";

export default async function ContributingEvacuationLocator() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const centers = await getEvacuationCenters();

  return (
    <div>
      <PageHeader
        eyebrow="Evacuation locator"
        title="Contribute · Evacuation Center"
        description="I-pin sa mapa ang evacuation center para makuha ang latitude at longitude. Pending muna ito hanggang ma-validate ng Validator."
      />
      <EvacuationLocatorForm userEmail={user.email ?? ""} centers={centers} />
    </div>
  );
}
