import CheckPermission from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface DiscussionInterface {
  children: ReactNode
}


export default async function DiscussionLayout({ children }: DiscussionInterface) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // TODO: To manage the user credentials
    // If not available, it will redirect to the login/registration
    const allowed = await CheckPermission(user?.id as string, "discuss")
    if (!allowed) return redirect("/")
    return children;
  }

  return redirect("/")
}
