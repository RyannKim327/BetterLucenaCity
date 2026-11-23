import { createClient as createServerClient } from "./server"
import { dispatchNotification, VALIDATOR_ROLES } from "@/lib/notifications"

export type DiscussionType = "announcements" | "legals" | "local_budget" | "procurement" | "evacuation_centers"

export interface DiscussionPayload {
  user_id: string
  title: string
  content: string
  data_source: string[]
  reference_id?: number | null
  reference_uuid?: string | null
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
    reference_id: data.reference_id ?? null,
    reference_uuid: data.reference_uuid ?? null,
  }
  const payload = { id: crypto.randomUUID(), ...normalized } as DiscussionPayload & { id: string }

  const { data: disData, error } = await supabase
    .from("discussion")
    .insert(payload)
    .select("id")
    .single()

  if (error) throw error

  await dispatchNotification(supabase, {
    category: "discussion",
    title: "New contribution awaiting validation",
    body: data.title,
    href: `/discussion/${disData.id}`,
    data: { discussionId: disData.id, discussionType: data.type, referenceId: data.reference_id ?? data.reference_uuid ?? null },
    roles: VALIDATOR_ROLES,
    excludeUserIds: [data.user_id],
  })

  return disData.id as string
}
