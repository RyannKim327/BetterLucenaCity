import { PageHeader } from "@/components/layout/page-header";
import { TransparencyPanel } from "@/components/contribute/transparency-panel";
import { createClient } from "@/lib/supabase/server";

export default async function ContributingTransparency() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Transparency"
        title="Contribute · Transparency Data"
        description="Upload CSV or JSON — we extract the data client-side, preview it as a table, and send only the parsed rows to the database (no file stored)."
      />
      <TransparencyPanel userEmail={user.email ?? ""} />
    </div>
  );
}
