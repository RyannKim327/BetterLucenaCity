import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supa = await createClient()
  const { data, error } = await supa
    .from("users")
    .select("username, avatar_url, user_type")
    .order("date_added", { ascending: true })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(data)
}
