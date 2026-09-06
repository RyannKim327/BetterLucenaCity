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
  if (!canValidate && !canContribute) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { data: discussion } = await supabase.from("discussion").select("user_id").eq("id", id).maybeSingle()
  if (!discussion) return NextResponse.json({ error: "Discussion not found" }, { status: 404 })
  if (!canValidate && discussion.user_id !== user.id) return NextResponse.json({ error: "Forbidden — only owner or validator may view comments" }, { status: 403 })

  const { data, error } = await supabase.from("discussion_comments").select("id, discussion_id, user_id, comment, reply, date_added").eq("discussion_id", id).order("date_added", { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Moderator sees usernames; non-moderator only sees id.substring(0,8) on frontend – don't leak usernames
  const isModerator = canValidate || (await CheckPermission(user.id, "maintainer")) || (await CheckPermission(user.id, "admin"))
  if (isModerator && data && data.length > 0) {
    const ids = [...new Set(data.map((c) => c.user_id))]
    const { data: users } = await supabase.from("users").select("id, username").in("id", ids)
    const map = new Map(users?.map((u) => [u.id, u.username]) ?? [])
    const enriched = data.map((c) => ({
      ...c,
      username: map.get(c.user_id) ?? null,
      // non-moderator clients should display user_id.slice(0,8); moderator gets username
      displayName: map.get(c.user_id) ?? c.user_id.slice(0, 8),
    }))
    return NextResponse.json(enriched)
  }
  // non-moderator: return raw without username; frontend will show id.slice(0,8)
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 })

  const canValidate = await CheckPermission(user.id, "validate")
  const canContribute = await CheckPermission(user.id, "contribute")
  if (!canValidate && !canContribute) return NextResponse.json({ error: "Forbidden — need contribute or validate" }, { status: 403 })

  const { data: discussion, error: dErr } = await supabase.from("discussion").select("id, user_id, is_open").eq("id", id).maybeSingle()
  if (dErr || !discussion) return NextResponse.json({ error: "Discussion not found" }, { status: 404 })
  if (discussion.is_open === false) return NextResponse.json({ error: "Thread is closed" }, { status: 403 })
  if (!canValidate && discussion.user_id !== user.id) return NextResponse.json({ error: "Forbidden — you can only comment on your own threads" }, { status: 403 })

  let body: { comment?: string; reply?: number | null }
  try {
    // support both JSON and form-data
    const ct = request.headers.get("content-type") ?? ""
    if (ct.includes("application/json")) {
      body = await request.json()
    } else if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
      const fd = await request.formData()
      body = { comment: String(fd.get("comment") ?? ""), reply: fd.get("reply") ? Number(fd.get("reply")) : null }
    } else {
      body = await request.json().catch(() => ({ comment: "" }))
    }
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const comment = (body.comment ?? "").trim()
  if (!comment) return NextResponse.json({ error: "comment is required" }, { status: 400 })
  if (comment.length > 2000) return NextResponse.json({ error: "comment too long (max 2000 chars)" }, { status: 400 })

  const reply = body.reply != null && !Number.isNaN(Number(body.reply)) ? Number(body.reply) : null
  if (reply !== null) {
    const { data: parent } = await supabase.from("discussion_comments").select("id, discussion_id").eq("id", reply).maybeSingle()
    if (!parent || parent.discussion_id !== id) return NextResponse.json({ error: "Invalid reply target" }, { status: 400 })
  }

  const { data, error } = await supabase.from("discussion_comments").insert({ discussion_id: id, user_id: user.id, comment, reply }).select("id, discussion_id, user_id, comment, reply, date_added").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Follow redirect for form posts — if request was form, redirect back to discussion page
  const accept = request.headers.get("accept") ?? ""
  const isForm = (request.headers.get("content-type") ?? "").includes("form")
  if (isForm || accept.includes("text/html")) {
    return NextResponse.redirect(new URL(`/discussion/${id}`, request.url), 303)
  }

  return NextResponse.json(data, { status: 201 })
}
