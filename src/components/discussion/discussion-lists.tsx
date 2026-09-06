import { createClient } from "@/lib/supabase/server";

export default async function DiscussionLists() {
  const supabase = await createClient()
  const { data: lists } = await supabase.from("discussion").select("*")
  return lists ?? []
}
