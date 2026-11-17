import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface PublishedAnnouncement {
  id: number;
  title: string;
  content: string;
  date_added: string;
}

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

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL)
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  return "https://better-lucena-city.vercel.app";
}

export async function getPublishedAnnouncements(
  limit = 50,
): Promise<PublishedAnnouncement[]> {
  const supa = publicClient();
  if (!supa) return [];

  const { data, error } = await supa
    .from("announcements")
    .select("id, title, content, date_added")
    .not("approved_by", "is", null)
    .order("date_added", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as PublishedAnnouncement[];
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
