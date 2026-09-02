import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supa = await createClient()
  // Only show approved contributors publicly — pending (approved=false) are hidden
  // until a Maintainer approves them (so we can vet who the contributors are).
  const { data, error } = await supa
    .from("users")
    .select("username, avatar_url, user_type")
    .eq("approved", true)
    .not("user_type", "is", null)
    .order("date_added", { ascending: true })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(data)
}
