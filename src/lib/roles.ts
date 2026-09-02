import { createClient } from "./supabase/server";

const roles: Record<string, string[]> = {
  "head_maintainer": ["ALL"],
  "maintainer": ["admin", "maintainer", "discuss", "report"],
  "data_collaborator": ["collect", "discuss", "report", "validate"],
  "data_validator": ["discuss", "report", "validate"],
  "tester": ["discuss", "report"]
}

export interface UserProfile {
  user_type: string | null;
  approved: boolean | null;
}

export async function getUserProfile(id: string): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("users").select("user_type, approved").eq("id", id).maybeSingle();
  if (!data) return null;
  return data as UserProfile;
}

export default async function CheckPermission(id: string, permission: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("users").select("user_type, approved").eq("id", id).maybeSingle();

  if (!data) return false;

  // Must be approved before any permission is granted.
  // Default (approved = false or null) means pending — no access.
  if (data.approved !== true) return false;

  const raw = data.user_type;
  if (!raw || typeof raw !== "string") return false;
  const trimmed = raw.trim();
  if (!trimmed) return false;

  const role = trimmed.replace(/\s/g, "_").toLowerCase();

  if (!role || !roles[role]) return false;
  return roles[role].includes(permission.toLowerCase()) || roles[role].includes("ALL");
}
