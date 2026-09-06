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

  let query = supabase.from("discussion").select("id, user_id, title, content, type, reference_id, date_added, is_open, data_source").order("date_added", { ascending: false })

  if (!canValidate && canContribute) {
    query = query.eq("user_id", user.id)
  }
  if (type) query = query.eq("type", type)
  if (isOpen !== null) query = query.eq("is_open", isOpen === "true")

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
