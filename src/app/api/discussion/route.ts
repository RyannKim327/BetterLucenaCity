import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import CheckPermission from "@/lib/roles"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 })

  const canValidate = await CheckPermission(user.id, "validate")
  const canContribute = await CheckPermission(user.id, "contribute")
  if (!canValidate && !canContribute) return NextResponse.json({ error: "Forbidden — need contribute or validate" }, { status: 403 })

  const url = request.nextUrl
  const type = url.searchParams.get("type")
  const isOpen = url.searchParams.get("is_open")
  const tab = url.searchParams.get("tab") // all | open | approved | archived

  let query = supabase.from("discussion").select("id, user_id, title, content, type, reference_id, date_added, is_open, data_source, approved_by, archive_by").order("date_added", { ascending: false })

  if (!canValidate && canContribute) {
    query = query.eq("user_id", user.id)
  }
  if (type) query = query.eq("type", type)
  if (isOpen !== null) query = query.eq("is_open", isOpen === "true")

  // tab filtering: approved => approved_by not null, archived => archive_by not null and approved_by is null, open => is_open true and both null
  if (tab === "approved") query = query.not("approved_by", "is", null)
  else if (tab === "archived") query = query.not("archive_by", "is", null).is("approved_by", null)
  else if (tab === "open") query = query.eq("is_open", true).is("approved_by", null).is("archive_by", null)
  else if (tab === "closed") query = query.eq("is_open", false)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
