import CheckPermission from "@/lib/roles"
import { createClient } from "@/lib/supabase/server"
import CreateDiscussion from "@/lib/supabase/create-discussion"
import { GetUserID } from "@/lib/supabase/get-user-id"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const query = url.searchParams
  const department = query.get("department")
  const year = query.get("year")

  const supabase = await createClient()
  let sql = supabase
    .from("local_budget")
    .select("id, data, department, year, data_source, approved_by")
    .not("approved_by", "is", null)


  if (department) {
    sql = sql.ilike("department", `${department}`)
  }
  if (year) {
    const y = parseInt(year, 10)
    if (!Number.isNaN(y)) sql = sql.eq("year", y)
  }

  sql = sql.order("id", { ascending: false })

  const { data: local, error } = await sql
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(local ?? [])
}

export async function POST(request: NextRequest) {
  let body: {
    title?: string
    content?: string
    data?: unknown
    department?: string
    year?: number | string
    data_source?: string | string[]
    dataSource?: string | string[]
    sourceUrl?: string
    sourceName?: string
  }
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
    else return { urls: [], error: "Invalid data_source format — use comma separated URLs like https://google.com, https://example.com or string[]" }
    const deduped: string[] = []
    for (const u of arr) if (!deduped.includes(u)) deduped.push(u)
    const invalid = deduped.filter((u) => !/^https?:\/\/.+/.test(u) || (() => { try { const x = new URL(u); return x.protocol !== "http:" && x.protocol !== "https:" } catch { return true } })())
    if (invalid.length > 0) return { urls: [], error: `Invalid URL(s): ${invalid.join(", ")} — each must be a valid https:// URL like https://google.com` }
    return { urls: deduped }
  }

  const user = await GetUserID()

  if (!user) {
    return NextResponse.json({ error: "You must be signed in" }, { status: 401 })
  }

  const allowed = await CheckPermission(user as string, "contribute")

  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized — contribute permission required" }, { status: 403 })
  }

  const title = (body.title ?? "").toString().trim()
  const content = (body.content ?? "").toString().trim()
  const department = (body.department ?? "").toString().trim()
  const rawYear = body.year
  const year = typeof rawYear === "string" ? parseInt(rawYear, 10) : rawYear as number | undefined
  const data = body.data
  const rawDataSource = (body.data_source ?? body.dataSource ?? body.sourceUrl ?? "") as unknown
  const { urls: dataSourceUrls, error: dsError } = parseDataSource(rawDataSource)
  if (dsError) return NextResponse.json({ error: dsError }, { status: 400 })
  // data_source is NOT NULL in DB (jsonb) — must be string[]; empty [] if no links provided
  const dataSourceForTable: string[] = dataSourceUrls

  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 })
  if (!department) return NextResponse.json({ error: "department is required" }, { status: 400 })
  if (!year || Number.isNaN(Number(year))) return NextResponse.json({ error: "valid year is required" }, { status: 400 })
  if (!data || (Array.isArray(data) && data.length === 0)) return NextResponse.json({ error: "data (extracted rows) is required" }, { status: 400 })

  const supabase = await createClient()
  const { data: budget, error } = await supabase
    .from("local_budget")
    .insert({
      data: data as never,
      department,
      year: Number(year),
      data_source: dataSourceForTable as never,
    })
    .select("id")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  try {
    const discussionId = await CreateDiscussion({
      title,
      data_source: dataSourceForTable,
      content: content || `Budget dataset: ${title} (${department}, ${year}) — ${Array.isArray(data) ? (data as unknown[]).length : 1} rows`,
      reference_id: budget.id as number,
      user_id: user,
      type: "local_budget",
    })

    return NextResponse.json({ message: "Data added successfully", id: budget.id, discussionId }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create discussion"
    return NextResponse.json({ error: msg, id: budget.id }, { status: 201 })
  }
}
