import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supa = await createClient()
  const { data, error } = await supa
    .from("announcements")
    .select("id, title, content, date_added")
    .not("approved_by", "is", null)
    .order("date_added", { ascending: false })

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "No announcements found" }, { status: error ? 500 : 200 })
  }

  return NextResponse.json(data)
}
