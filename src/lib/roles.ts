import { createClient } from "./supabase/server";

const roles: Record<string, string[]> = {
  "head_maintainer": ["ALL"],
  "maintainer": ["admin", "maintainer", "report"],
  "data_collaborator": ["collect", "report", "validate"],
  "data_validator": ["report", "validate"],
  "tester": ["report"]
}

export default async function CheckPermission(id: string, permission: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("users").select("user_type").eq("id", id)

  if (!data) return false

  const role = data[0].user_type.trim().replace(/\s/i, "_").toLowerCase()

  if (!role) return false
  return roles[role].includes(permission.toLowerCase()) || roles[role].includes("ALL")
}
