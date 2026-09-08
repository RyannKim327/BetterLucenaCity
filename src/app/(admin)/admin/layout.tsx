import Forbidden from "@/app/forbidden";
import CheckPermission from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";
import { ReactNode } from "react";
import { DashboardNav } from "@/components/admin/dashboard-nav";

interface AdminContainerInterface {
  children: ReactNode
}

export default async function AdminContainer({ children }: AdminContainerInterface) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO: auth
  const allowed = await CheckPermission(user?.id as string, "admin")

  if (!allowed) return <Forbidden />

  return (
    <div className="flex flex-col mx-auto max-w-6xl gap-4 px-4 py-16 sm:px-6">
      <DashboardNav variant="admin" />
      {children}
    </div>
  )
}
