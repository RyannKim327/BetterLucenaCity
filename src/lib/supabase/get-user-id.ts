import { createClient } from "./client"

export async function GetUserID() {
  const supabase = createClient()
  const { data: user } = await supabase.auth.getUser()

  return user.user?.id
}
