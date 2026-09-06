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

  if (user) {
    // TODO: To manage the user credentials
    // If not available, it will redirect to the login/registration
    const allowed = await CheckPermission(user?.id as string, "discussion")
    if (!allowed) return <Forbidden />
    return children;
  }
  return <Forbidden />
}
