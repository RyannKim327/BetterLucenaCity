import { PageHeader } from "@/components/layout/page-header";
import { allRoles, roles } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function UserInformation() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: usr } = await supabase.from("users").select("user_type").eq("id", user?.id).maybeSingle()
  let role = roles[usr?.user_type.toLowerCase().replace(/\s/gi, "_") ?? ""] ?? []
  role = role[0] === "ALL" ? allRoles : role

  return (
    <div>
      <PageHeader
        title="User Information"
        description="This will show only the information related to the current logged in user" />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex justify-center w-full gap-2">
          {role.map((r: string, i: number) => {
            return (
              <Link href={r} key={`${i}. ${r}`}>{r[0].toUpperCase()}{r.substring(1)}</Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
