import { createClient } from "./server"

export async function GetUserID() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return user?.id ?? null
}
