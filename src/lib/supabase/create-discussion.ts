import { createClient } from "./client"

type discussionType = "announcements" | "legals" | "local_budget" | "procurement"

interface discussion {
  user_id: string
  title: string
  content: string
  data_source: Record<string, any> | number[] | string[]
  reference_id: string
  type: discussionType
}

export default async function CreateDiscussion(discuss: discussionType, data: discussion) {
  const supabase = createClient()

  const { data: disData, error } = await supabase
    .from(discuss)
    .insert(data)
    .select("id")
    .single()

  if (error) return error

  return disData.id
}
