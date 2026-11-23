import { createClient } from "@/lib/supabase/server"
import { NextResponse, NextRequest } from "next/server"

export const dynamic = "force-dynamic"

function parseDataSource(input: unknown): { urls: string[]; error?: string } {
  if (input == null || input === "") return { urls: [] }
  let arr: string[] = []
  if (Array.isArray(input)) arr = input.map((v) => String(v).trim()).filter(Boolean)
  else if (typeof input === "string") arr = input.split(",").map((s) => s.trim()).filter(Boolean)
  else return { urls: [], error: "Invalid data_source format" }
  const deduped: string[] = []
  for (const u of arr) if (!deduped.includes(u)) deduped.push(u)
  const invalid = deduped.filter((u) => !/^https?:\/\/.+/.test(u) || (() => {
    try {
      const x = new URL(u)
      return x.protocol !== "http:" && x.protocol !== "https:"
    } catch {
      return true
    }
  })())
  if (invalid.length > 0) return { urls: [], error: `Invalid URL(s): ${invalid.join(", ")}` }
  return { urls: deduped }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 })

  const { default: CheckPermission } = await import("@/lib/roles")
  const allowed = await CheckPermission(user.id, "contribute")
  if (!allowed) return NextResponse.json({ error: "Unauthorized — contribute permission required" }, { status: 403 })

  let body: { name?: string; barangay?: string; latitude?: unknown; longitude?: unknown; data_source?: string | string[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const name = (body.name ?? "").trim()
  const barangay = (body.barangay ?? "").trim()
  const latitude = typeof body.latitude === "string" ? parseFloat(body.latitude) : Number(body.latitude)
  const longitude = typeof body.longitude === "string" ? parseFloat(body.longitude) : Number(body.longitude)
  const { urls: dataSource, error: dsError } = parseDataSource(body.data_source)
  if (dsError) return NextResponse.json({ error: dsError }, { status: 400 })

  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 })
  if (!barangay) return NextResponse.json({ error: "barangay is required" }, { status: 400 })
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return NextResponse.json({ error: "Valid latitude is required" }, { status: 400 })
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return NextResponse.json({ error: "Valid longitude is required" }, { status: 400 })
  }

  const { data: inserted, error } = await supabase
    .from("evacuation_centers")
    .insert({
      name,
      barangay,
      latitude,
      longitude,
      submitted_by: user.id,
      data_source: dataSource,
    } as never)
    .select("id, name, barangay, latitude, longitude")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  try {
    const { default: CreateDiscussion } = await import("@/lib/supabase/create-discussion")
    const discussionId = await CreateDiscussion({
      title: `Evacuation center: ${name} (${barangay})`,
      content: `Bagong evacuation center submission:\n\n- Name: ${name}\n- Barangay: ${barangay}\n- Latitude: ${latitude.toFixed(6)}\n- Longitude: ${longitude.toFixed(6)}\n\nPaki-validate ang lokasyon at impormasyon bago i-approve.`,
      data_source: dataSource,
      reference_uuid: inserted.id as string,
      user_id: user.id,
      type: "evacuation_centers",
    })
    return NextResponse.json({ message: "Evacuation center submitted for validation", id: inserted.id, discussionId }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create discussion"
    return NextResponse.json({ error: msg, id: inserted.id }, { status: 201 })
  }
}
