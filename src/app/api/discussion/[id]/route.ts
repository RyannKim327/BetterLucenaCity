import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import CheckPermission from "@/lib/roles"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 })

  const canValidate = await CheckPermission(user.id, "validate")
  const canContribute = await CheckPermission(user.id, "contribute")
  if (!canValidate && !canContribute) return NextResponse.json({ error: "Forbidden — need contribute or validate" }, { status: 403 })

  const { data, error } = await supabase.from("discussion").select("id, user_id, title, content, type, reference_id, date_added, is_open, data_source").eq("id", id).maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (!canValidate && data.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden — you can only access your own discussions" }, { status: 403 })
  }

  // Optionally include linked record
  let linked: unknown = null
  if (data.type === "legals") {
    const { data: r } = await supabase.from("legals").select("*").eq("id", data.reference_id).maybeSingle()
    linked = r
  } else if (data.type === "announcements") {
    const { data: r } = await supabase.from("announcements").select("*").eq("id", data.reference_id).maybeSingle()
    linked = r
  } else if (data.type === "local_budget") {
    const { data: r } = await supabase.from("local_budget").select("*").eq("id", data.reference_id).maybeSingle()
    linked = r
  } else if (data.type === "procurement") {
    const { data: r } = await supabase.from("procurement").select("*").eq("id", data.reference_id).maybeSingle()
    linked = r
  }

  const { data: comments } = await supabase.from("discussion_comments").select("id, user_id, comment, reply, date_added").eq("discussion_id", id).order("date_added", { ascending: true })

  return NextResponse.json({ discussion: data, linked, comments: comments ?? [] })
}
