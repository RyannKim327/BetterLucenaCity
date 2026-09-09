import { createClient } from "@/lib/supabase/server"
import { NextResponse, NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 })

  const { default: CheckPermission } = await import("@/lib/roles")
  const allowed = await CheckPermission(user.id, "contribute")
  if (!allowed) return NextResponse.json({ error: "Unauthorized — contribute permission required" }, { status: 403 })

  let body: { title?: string; content?: string; date_added?: string; source?: string; sourceUrl?: string; data_source?: string | string[]; dataSource?: string | string[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  function parseDataSource(input: unknown): { urls: string[]; error?: string } {
    if (input == null || input === "") return { urls: [] }
    let arr: string[] = []
    if (Array.isArray(input)) arr = input.map((v) => String(v).trim()).filter(Boolean)
    else if (typeof input === "string") arr = input.split(",").map((s) => s.trim()).filter(Boolean)
    else return { urls: [], error: "Invalid data_source format" }
    const deduped: string[] = []
    for (const u of arr) if (!deduped.includes(u)) deduped.push(u)
    const invalid = deduped.filter((u) => !/^https?:\/\/.+/.test(u) || (() => { try { const x = new URL(u); return x.protocol !== "http:" && x.protocol !== "https:" } catch { return true } })())
    if (invalid.length > 0) return { urls: [], error: `Invalid URL(s): ${invalid.join(", ")} — each must be a valid https:// URL like https://google.com` }
    return { urls: deduped }
  }

  const title = (body.title ?? "").trim()
  const content = (body.content ?? "").trim()
  const dateAddedRaw = (body.date_added ?? "").trim()
  const rawSource = (body.data_source ?? body.dataSource ?? body.source ?? body.sourceUrl ?? "") as unknown
  const { urls: dataSourceUrls, error: dsError } = parseDataSource(rawSource)
  if (dsError) return NextResponse.json({ error: dsError }, { status: 400 })

  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 })
  if (!content) return NextResponse.json({ error: "content is required" }, { status: 400 })

  let dateAdded: string | null = null
  if (dateAddedRaw) {
    const d = new Date(dateAddedRaw)
    if (Number.isNaN(d.getTime())) return NextResponse.json({ error: "Invalid date_added" }, { status: 400 })
    dateAdded = d.toISOString()
  }

  const { data: inserted, error } = await supabase
    .from("announcements")
    .insert({
      title,
      content,
      date_added: dateAdded,
      data_source: dataSourceUrls,
    } as never)
    .select("id")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const discussionDataSource: string[] = dataSourceUrls

  try {
    const { default: CreateDiscussion } = await import("@/lib/supabase/create-discussion")
    const discussionId = await CreateDiscussion({
      title,
      content,
      data_source: discussionDataSource,
      reference_id: inserted.id as number,
      user_id: user.id,
      type: "announcements",
    })
    return NextResponse.json({ message: "Announcement submitted for validation", id: inserted.id, discussionId }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create discussion"
    return NextResponse.json({ error: msg, id: inserted.id }, { status: 201 })
  }
}

export async function GET() {
  const supa = await createClient()
  const { data, error } = await supa
    .from("announcements")
    .select("id, title, content, date_added, data_source")
    .not("approved_by", "is", null)
    .order("date_added", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
