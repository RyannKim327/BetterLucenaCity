import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { EvacuationCenter } from "@/types/emergency";

let cachedClient: SupabaseClient | null = null;

function publicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  if (!cachedClient) {
    cachedClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cachedClient;
}

export async function getEvacuationCenters(): Promise<EvacuationCenter[]> {
  const supa = publicClient();
  if (!supa) return [];

  const { data, error } = await supa
    .from("evacuation_centers")
    .select("id, name, barangay, latitude, longitude")
    .order("name", { ascending: true });

  if (error) return [];
  return (data ?? []) as EvacuationCenter[];
}
