import Forbidden from "@/app/forbidden";
import { createClient } from "@/lib/supabase/server";
import { ReactNode } from "react";

interface UserLayoutInterface {
  children: ReactNode
}

export default async function UserLayout({ children }: UserLayoutInterface) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) <Forbidden />

  return children
}
