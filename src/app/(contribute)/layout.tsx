import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { AuthButtons } from "@/components/sections/auth-buttons";
import { createClient } from "@/lib/supabase/server";
import { ReactNode } from "react";

interface ContributeInterface {
  children: ReactNode
}

export default async function ContributorContainer({ children }: ContributeInterface) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div>
        <PageHeader
          eyebrow="Pakikibahagi"
          title="Contribute"
          description="A section where the community may able to share information from their reliable sources."
        />
        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr]">
          <Card>
            <h2 className="text-base font-semibold">Mag-sign in muna (Sign in first)</h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              To keep sources trustworthy, contributions are open to signed-in
              residents only. Continue with your Google or GitHub account.
            </p>
            <div className="mt-6">
              <AuthButtons
                redirectTo="/contribute"
                message="Choose a provider to continue."
              />
            </div>
          </Card>

          <Card className="h-fit">
            <h2 className="text-base font-semibold">Mga paalala (Guidelines)</h2>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-on-surface-variant">
              <li>• Submit only from reliable, verifiable sources.</li>
              <li>• Include a reference link whenever possible.</li>
              <li>• Keep details factual and free of personal opinions.</li>
              <li>• Sensitive or personal data will not be published.</li>
            </ul>
          </Card>
        </section>
      </div>
    );
  }

  return children
}
