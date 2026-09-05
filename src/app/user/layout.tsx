import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface UserLayoutInterface {
  children: ReactNode
}

export default async function UserLayout({ children }: UserLayoutInterface) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/")

  return children
}
