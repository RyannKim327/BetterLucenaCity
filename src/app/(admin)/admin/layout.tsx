import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface AdminContainerInterface {
  children: ReactNode
}

export default async function AdminContainer({ children }: AdminContainerInterface) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO: auth
  const isAdmin = true

  if (!isAdmin) {
    redirect("/")
  }

  return (
    <div className="flex flex-col mx-auto max-w-6xl gap-4 px-4 py-16 sm:px-6">
      {children}
    </div>
  )
}
