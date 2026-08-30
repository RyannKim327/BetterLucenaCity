import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supa = await createClient()
  const { data } = await supa
    .from("announcements")
    .select("*")
    .order("date_added", { ascending: false })

  return NextResponse.json(data)
}
