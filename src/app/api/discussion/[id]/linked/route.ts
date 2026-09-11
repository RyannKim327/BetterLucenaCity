import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import CheckPermission from "@/lib/roles"

export const dynamic = "force-dynamic"

function parseDataSource(input: unknown): { urls: string[]; error?: string } {
  if (input == null || input === "") return { urls: [] }
  let arr: string[] = []
  if (Array.isArray(input)) arr = input.map((v) => String(v).trim()).filter(Boolean)
  else if (typeof input === "string") arr = input.split(",").map((s) => s.trim()).filter(Boolean)
  else return { urls: [], error: "Invalid data_source format — use comma separated URLs like https://google.com, https://example.com or string[]" }
  const deduped: string[] = []
  for (const u of arr) if (!deduped.includes(u)) deduped.push(u)
  const invalid = deduped.filter((u) => !/^https?:\/\/.+/.test(u) || (() => { try { const x = new URL(u); return x.protocol !== "http:" && x.protocol !== "https:" } catch { return true } })())
  if (invalid.length > 0) return { urls: [], error: `Invalid URL(s): ${invalid.join(", ")} — each must be a valid https:// URL like https://google.com` }
  return { urls: deduped }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 })

  const canValidate = await CheckPermission(user.id, "validate")
  const canContribute = await CheckPermission(user.id, "contribute")
  if (!canValidate && !canContribute) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { data: discussion, error } = await supabase.from("discussion").select("id, user_id, title, content, type, reference_id, date_added, is_open, data_source, approved_by, archive_by").eq("id", id).maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!discussion) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (!canValidate && discussion.user_id !== user.id) return NextResponse.json({ error: "Forbidden — you can only access your own discussions" }, { status: 403 })

  let linked: unknown = null
  if (discussion.type === "announcements") {
    const { data } = await supabase.from("announcements").select("*").eq("id", discussion.reference_id).maybeSingle()
    linked = data
  } else if (discussion.type === "legals") {
    const { data } = await supabase.from("legals").select("*").eq("id", discussion.reference_id).maybeSingle()
    linked = data
  } else if (discussion.type === "local_budget") {
    const { data } = await supabase.from("local_budget").select("*").eq("id", discussion.reference_id).maybeSingle()
    linked = data
  } else if (discussion.type === "procurement") {
    const { data } = await supabase.from("procurement").select("*").eq("id", discussion.reference_id).maybeSingle()
    linked = data
  }

  return NextResponse.json({ discussion, linked })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 })

  const canValidate = await CheckPermission(user.id, "validate")
  const canContribute = await CheckPermission(user.id, "contribute")
  if (!canValidate && !canContribute) return NextResponse.json({ error: "Forbidden — need contribute or validate" }, { status: 403 })

  const { data: discussion, error: dErr } = await supabase.from("discussion").select("id, user_id, title, content, type, reference_id, data_source, is_open, approved_by, archive_by").eq("id", id).maybeSingle()
  if (dErr) return NextResponse.json({ error: dErr.message }, { status: 500 })
  if (!discussion) return NextResponse.json({ error: "Discussion not found" }, { status: 404 })

  // Permission: only the data collector (owner) may edit linked data while open
  // Validators may also edit if needed, but owner is primary. Enforce owner OR validator.
  const isOwner = discussion.user_id === user.id
  if (!isOwner && !canValidate) {
    return NextResponse.json({ error: "Forbidden — only the data collector (owner) or a validator may edit linked data" }, { status: 403 })
  }
  if (!isOwner && canValidate) {
    // allow validator to edit as well — keep permissive for moderation fixes
  }

  // Once done (approved) it must not be editable — DB trigger also enforces this
  if (discussion.approved_by) {
    return NextResponse.json({ error: "Linked record is approved and locked — cannot be edited after validation. Open a correction discussion if needed." }, { status: 403 })
  }
  if (discussion.is_open === false && discussion.archive_by) {
    // archived is temporarily closed — block edits until unarchived
    return NextResponse.json({ error: "Thread is archived (temporarily closed) — unarchive to allow edits again" }, { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const rawDataSource = (body.data_source ?? body.dataSource ?? (body as Record<string, unknown>).sourceUrl ?? (body as Record<string, unknown>).source_url) as unknown
  // Only validate data_source if it was actually supplied
  const hasDataSource = body.data_source !== undefined || body.dataSource !== undefined
  let dataSourceUrls: string[] | null = null
  if (hasDataSource) {
    const parsed = parseDataSource(rawDataSource)
    if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 })
    dataSourceUrls = parsed.urls
  }

  const type = discussion.type as string
  const refId = discussion.reference_id as number

  try {
    if (type === "announcements") {
      const title = body.title !== undefined ? String(body.title).trim() : undefined
      const content = body.content !== undefined ? String(body.content).trim() : undefined
      const dateAddedRaw = body.date_added !== undefined ? String(body.date_added).trim() : undefined

      if (title !== undefined && !title) return NextResponse.json({ error: "title cannot be empty" }, { status: 400 })
      if (content !== undefined && !content) return NextResponse.json({ error: "content cannot be empty" }, { status: 400 })

      let dateAdded: string | null | undefined = undefined
      if (dateAddedRaw !== undefined) {
        if (dateAddedRaw === "" || dateAddedRaw === null) dateAdded = null
        else {
          const d = new Date(dateAddedRaw)
          if (Number.isNaN(d.getTime())) return NextResponse.json({ error: "Invalid date_added" }, { status: 400 })
          dateAdded = d.toISOString()
        }
      }

      // Fetch current to ensure not already approved (linked table guard)
      const { data: current, error: curErr } = await supabase.from("announcements").select("id, approved_by, title, content, data_source, date_added").eq("id", refId).maybeSingle()
      if (curErr) return NextResponse.json({ error: curErr.message }, { status: 500 })
      if (!current) return NextResponse.json({ error: "Linked announcement not found" }, { status: 404 })
      if ((current as { approved_by: string | null }).approved_by) {
        return NextResponse.json({ error: "Linked announcement is approved and locked" }, { status: 403 })
      }

      const updateLinked: Record<string, unknown> = {}
      if (title !== undefined) updateLinked.title = title
      if (content !== undefined) updateLinked.content = content
      if (dataSourceUrls !== null) updateLinked.data_source = dataSourceUrls
      if (dateAdded !== undefined) updateLinked.date_added = dateAdded

      if (Object.keys(updateLinked).length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 })

      const { error: updErr } = await supabase.from("announcements").update(updateLinked as never).eq("id", refId)
      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

      // Sync discussion row (title/content/data_source) so thread stays consistent
      const discussionUpdate: Record<string, unknown> = {}
      if (title !== undefined) discussionUpdate.title = title
      if (content !== undefined) discussionUpdate.content = content
      if (dataSourceUrls !== null) discussionUpdate.data_source = dataSourceUrls

      if (Object.keys(discussionUpdate).length > 0) {
        const { error: dUpdErr } = await supabase.from("discussion").update(discussionUpdate as never).eq("id", id)
        if (dUpdErr) return NextResponse.json({ error: dUpdErr.message }, { status: 500 })
      }

      const { data: refreshed } = await supabase.from("announcements").select("*").eq("id", refId).maybeSingle()
      return NextResponse.json({ message: "Announcement updated", linked: refreshed })
    }

    if (type === "legals") {
      const title = body.title !== undefined ? String(body.title).trim() : undefined
      const summary = body.summary !== undefined ? String(body.summary).trim() : undefined
      const content = body.content !== undefined ? String(body.content).trim() : undefined
      const ordinance_type = body.ordinance_type !== undefined ? String(body.ordinance_type).trim() : undefined
      const reference = body.reference !== undefined ? String(body.reference).trim() : undefined
      const source_url = body.source_url !== undefined ? String(body.source_url).trim() : (body.sourceUrl !== undefined ? String(body.sourceUrl).trim() : undefined)
      const source_name = body.source_name !== undefined ? String(body.source_name).trim() : (body.sourceName !== undefined ? String(body.sourceName).trim() : undefined)

      if (title !== undefined && !title) return NextResponse.json({ error: "title cannot be empty" }, { status: 400 })

      const { data: current, error: curErr } = await supabase.from("legals").select("id, approved_by").eq("id", refId).maybeSingle()
      if (curErr) return NextResponse.json({ error: curErr.message }, { status: 500 })
      if (!current) return NextResponse.json({ error: "Linked legal not found" }, { status: 404 })
      if ((current as { approved_by: string | null }).approved_by) return NextResponse.json({ error: "Linked record is approved and locked" }, { status: 403 })

      const updateLinked: Record<string, unknown> = {}
      if (title !== undefined) updateLinked.title = title
      if (summary !== undefined) updateLinked.summary = summary
      if (content !== undefined) updateLinked.content = content
      if (ordinance_type !== undefined) updateLinked.ordinance_type = ordinance_type
      if (reference !== undefined) updateLinked.reference = reference || null
      if (source_url !== undefined) {
        if (source_url && !/^https?:\/\/.+/.test(source_url)) return NextResponse.json({ error: "source_url must be valid https:// URL" }, { status: 400 })
        updateLinked.source_url = source_url || null
      }
      if (source_name !== undefined) updateLinked.source_name = source_name || null
      if (dataSourceUrls !== null) updateLinked.data_source = dataSourceUrls

      if (Object.keys(updateLinked).length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 })

      const { error: updErr } = await supabase.from("legals").update(updateLinked as never).eq("id", refId)
      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

      const discussionUpdate: Record<string, unknown> = {}
      if (title !== undefined) discussionUpdate.title = title
      if (content !== undefined || summary !== undefined) discussionUpdate.content = content ?? summary
      if (dataSourceUrls !== null) discussionUpdate.data_source = dataSourceUrls

      if (Object.keys(discussionUpdate).length > 0) {
        await supabase.from("discussion").update(discussionUpdate as never).eq("id", id)
      }

      const { data: refreshed } = await supabase.from("legals").select("*").eq("id", refId).maybeSingle()
      return NextResponse.json({ message: "Legal document updated", linked: refreshed })
    }

    if (type === "local_budget") {
      const department = body.department !== undefined ? String(body.department).trim() : undefined
      const yearRaw = body.year
      const data = body.data

      if (department !== undefined && !department) return NextResponse.json({ error: "department cannot be empty" }, { status: 400 })

      const { data: current, error: curErr } = await supabase.from("local_budget").select("id, approved_by").eq("id", refId).maybeSingle()
      if (curErr) return NextResponse.json({ error: curErr.message }, { status: 500 })
      if (!current) return NextResponse.json({ error: "Linked budget not found" }, { status: 404 })
      if ((current as { approved_by: string | null }).approved_by) return NextResponse.json({ error: "Linked record is approved and locked" }, { status: 403 })

      const updateLinked: Record<string, unknown> = {}
      if (department !== undefined) updateLinked.department = department
      if (yearRaw !== undefined) {
        const y = typeof yearRaw === "string" ? parseInt(yearRaw, 10) : Number(yearRaw)
        if (Number.isNaN(y)) return NextResponse.json({ error: "Invalid year" }, { status: 400 })
        updateLinked.year = y
      }
      if (data !== undefined) updateLinked.data = data as never
      if (dataSourceUrls !== null) updateLinked.data_source = dataSourceUrls

      if (Object.keys(updateLinked).length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 })

      const { error: updErr } = await supabase.from("local_budget").update(updateLinked as never).eq("id", refId)
      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

      if (dataSourceUrls !== null) {
        await supabase.from("discussion").update({ data_source: dataSourceUrls } as never).eq("id", id)
      }

      const { data: refreshed } = await supabase.from("local_budget").select("*").eq("id", refId).maybeSingle()
      return NextResponse.json({ message: "Budget updated", linked: refreshed })
    }

    if (type === "procurement") {
      const source = body.source !== undefined ? String(body.source).trim() : undefined
      const pricebidRaw = body.pricebid

      const { data: current, error: curErr } = await supabase.from("procurement").select("id, approved_by").eq("id", refId).maybeSingle()
      if (curErr) return NextResponse.json({ error: curErr.message }, { status: 500 })
      if (!current) return NextResponse.json({ error: "Linked procurement not found" }, { status: 404 })
      if ((current as { approved_by: string | null }).approved_by) return NextResponse.json({ error: "Linked record is approved and locked" }, { status: 403 })

      const updateLinked: Record<string, unknown> = {}
      if (source !== undefined) updateLinked.source = source
      if (pricebidRaw !== undefined) {
        const pb = Number(pricebidRaw)
        if (Number.isNaN(pb)) return NextResponse.json({ error: "Invalid pricebid" }, { status: 400 })
        updateLinked.pricebid = pb
      }
      if (body.date !== undefined) updateLinked.date = body.date ? new Date(String(body.date)).toISOString() : null
      if (dataSourceUrls !== null) updateLinked.data_source = dataSourceUrls

      if (Object.keys(updateLinked).length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 })

      const { error: updErr } = await supabase.from("procurement").update(updateLinked as never).eq("id", refId)
      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

      if (dataSourceUrls !== null) {
        await supabase.from("discussion").update({ data_source: dataSourceUrls } as never).eq("id", id)
      }

      const { data: refreshed } = await supabase.from("procurement").select("*").eq("id", refId).maybeSingle()
      return NextResponse.json({ message: "Procurement updated", linked: refreshed })
    }

    return NextResponse.json({ error: `Editing not supported for type: ${type}` }, { status: 400 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to update linked data"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
