import { createClient as createServerClient } from "./server"

export type discussionType = "announcements" | "legals" | "local_budget" | "procurement"

export interface DiscussionInsert {
  user_id: string
  title: string
  content: string
  data_source: string[]
  reference_id: number
  type: discussionType
}

export default async function CreateDiscussion(data: DiscussionInsert) {
  const supabase = await createServerClient()

  const normalized = {
    ...data,
    data_source: data.data_source ?? [],
  }
  const payload = { id: crypto.randomUUID(), ...normalized } as DiscussionInsert & { id: string }

  const { data: disData, error } = await supabase
    .from("discussion")
    .insert(payload)
    .select("id")
    .single()

  if (error) throw error

  return disData.id as string
}
