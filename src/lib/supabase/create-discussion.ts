import { createClient as createServerClient } from "./server"

export type DiscussionType = "announcements" | "legals" | "local_budget" | "procurement"

export interface DiscussionPayload {
  user_id: string
  title: string
  content: string
  data_source: string[]
  reference_id: number
  type: DiscussionType
}

// kept for backwards compat with older imports
export type discussionType = DiscussionType
export type DiscussionInsert = DiscussionPayload

export default async function CreateDiscussion(data: DiscussionPayload) {
  const supabase = await createServerClient()

  const normalized: DiscussionPayload = {
    ...data,
    data_source: data.data_source ?? [],
  }
  const payload = { id: crypto.randomUUID(), ...normalized } as DiscussionPayload & { id: string }

  const { data: disData, error } = await supabase
    .from("discussion")
    .insert(payload)
    .select("id")
    .single()

  if (error) throw error

  return disData.id as string
}
