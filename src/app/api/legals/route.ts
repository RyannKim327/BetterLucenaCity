import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LEGAL_DOC_TYPES } from "@/types/legal";
import { isLegalDocType } from "@/lib/data/legal-documents";
import type { LegalDocument } from "@/types/legal";

export const dynamic = "force-dynamic";

const legalDisclaimer =
  "City-level entries below are compiled from official public records and published session reports of the Sangguniang Panlungsod of Lucena. National laws listed are verifiable public statutes. Where a document's official text is not yet available online, the entry is marked 'pending verification' pending confirmation against the records of the Sangguniang Panlungsod.";

interface LegalRow {
  id: number;
  title: string;
  content: string | null;
  summary: string | null;
  reference: string | null;
  resolution_number: string | null;
  ordinance_type: string | null;
  proclamation_date: string | null;
  approved_by: string | null;
  source_url: string | null;
  source_name: string | null;
}

function toLegalDocument(row: LegalRow): LegalDocument {
  return {
    id: String(row.id),
    type: (row.ordinance_type as LegalDocument["type"]) ?? "city_ordinance",
    number: row.reference ?? row.resolution_number ?? "",
    title: row.title,
    date: row.proclamation_date ?? null,
    summary: row.summary ?? row.content ?? "",
    sourceUrl: row.source_url ?? undefined,
    sourceName: row.source_name ?? undefined,
    verification: row.approved_by !== null,
  };
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 })

  const { default: CheckPermission } = await import("@/lib/roles")
  const allowed = await CheckPermission(user.id, "contribute")
  if (!allowed) return NextResponse.json({ error: "Unauthorized — contribute permission required" }, { status: 403 })

  let body: {
    title?: string
    ordinance_type?: string
    reference?: string
    summary?: string
    content?: string
    proclamation_date?: string | null
    source_url?: string
    source_name?: string
    sourceUrl?: string
    sourceName?: string
    data_source?: string | string[]
    dataSource?: string | string[]
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
    else return { urls: [], error: "Invalid data_source format" }
    const deduped: string[] = []
    for (const u of arr) if (!deduped.includes(u)) deduped.push(u)
    const invalid = deduped.filter((u) => !/^https?:\/\/.+/.test(u) || (() => { try { const x = new URL(u); return x.protocol !== "http:" && x.protocol !== "https:" } catch { return true } })())
    if (invalid.length > 0) return { urls: [], error: `Invalid URL(s): ${invalid.join(", ")} — each must be a valid https:// URL like https://google.com` }
    return { urls: deduped }
  }

  const title = (body.title ?? "").trim()
  const ordinance_type = (body.ordinance_type ?? (body as unknown as Record<string, unknown>).type as string ?? "").trim()
  const reference = (body.reference ?? "").trim()
  const summary = (body.summary ?? "").trim()
  const content = (body.content ?? "").trim()
  const proclamation_date = (body.proclamation_date ?? null) as string | null
  const source_url = (body.source_url ?? body.sourceUrl ?? "").trim()
  const source_name = (body.source_name ?? body.sourceName ?? "").trim()
  const rawDataSource = (body.data_source ?? body.dataSource ?? (source_url || "")) as unknown

  const { urls: dataSourceUrls, error: dsError } = parseDataSource(rawDataSource)
  if (dsError) return NextResponse.json({ error: dsError }, { status: 400 })

  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 })
  if (!ordinance_type) return NextResponse.json({ error: "ordinance_type (document type) is required" }, { status: 400 })
  if (!isLegalDocType(ordinance_type)) {
    return NextResponse.json({ error: "Invalid ordinance_type", allowed: LEGAL_DOC_TYPES.map((t) => t.id) }, { status: 400 })
  }
  if (!summary) return NextResponse.json({ error: "summary is required" }, { status: 400 })
  // fallback single source_url validation is now covered by dataSourceUrls; keep for backward compat
  if (source_url && !/^https?:\/\/.+/.test(source_url)) {
    return NextResponse.json({ error: "source_url must be a valid URL like https://google.com" }, { status: 400 })
  }
  let parsedDate: string | null = null
  if (proclamation_date) {
    const d = new Date(proclamation_date)
    if (Number.isNaN(d.getTime())) return NextResponse.json({ error: "Invalid proclamation_date" }, { status: 400 })
    parsedDate = d.toISOString()
  }

  // data_source is NOT NULL (jsonb) — store as string[] (empty [] if none)
  const discussionDataSource: string[] = dataSourceUrls
  const firstUrl = dataSourceUrls[0] ?? (source_url || null)

  const { data: inserted, error } = await supabase
    .from("legals")
    .insert({
      title,
      ordinance_type: ordinance_type as never,
      reference: reference || null,
      summary,
      content: content || summary,
      proclamation_date: parsedDate,
      source_url: firstUrl,
      source_name: source_name || null,
      data_source: discussionDataSource,
    } as never)
    .select("id")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  try {
    const { default: CreateDiscussion } = await import("@/lib/supabase/create-discussion")
    const discussionId = await CreateDiscussion({
      title,
      content: content || summary,
      data_source: discussionDataSource,
      reference_id: inserted.id as number,
      user_id: user.id,
      type: "legals",
    })
    return NextResponse.json({ message: "Legal document submitted for validation", id: inserted.id, discussionId }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create discussion"
    return NextResponse.json({ error: msg, id: inserted.id }, { status: 201 })
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get("type");

  if (type && !isLegalDocType(type)) {
    return NextResponse.json(
      { error: "Invalid document type", allowed: LEGAL_DOC_TYPES.map((t) => t.id) },
      { status: 400 }
    );
  }

  const supa = await createClient();
  let query = supa.from("legals").select("*");

  if (type) query = query.eq("ordinance_type", type);

  const { data, error } = await query.order("proclamation_date", {
    ascending: false,
    nullsFirst: false,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message, documents: [], totalByType: {}, total: 0 },
      { status: 500 }
    );
  }

  const rows = (data ?? []) as LegalRow[];
  const documents = rows.map(toLegalDocument);

  const countsByType = Object.fromEntries(
    LEGAL_DOC_TYPES.map((t) => [
      t.id,
      rows.filter((r) => r.ordinance_type === t.id).length,
    ])
  );

  return NextResponse.json({
    locality: "Lucena City, Quezon",
    disclaimer: legalDisclaimer,
    total: documents.length,
    totalByType: countsByType,
    types: LEGAL_DOC_TYPES,
    documents,
  });
}
