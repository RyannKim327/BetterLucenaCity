import Forbidden from "@/app/forbidden";
import CheckPermission from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";
import { ReactNode } from "react";

interface DiscussionInterface {
  children: ReactNode
}


export default async function DiscussionLayout({ children }: DiscussionInterface) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <Forbidden />

  const canContribute = await CheckPermission(user.id, "contribute")
  const canValidate = await CheckPermission(user.id, "validate")

  if (!canContribute && !canValidate) return <Forbidden />

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {children}
    </div>
  )
}
