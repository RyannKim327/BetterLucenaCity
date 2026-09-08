import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import CheckPermission from "@/lib/roles";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 });

  const canSeeAll =
    (await CheckPermission(user.id, "maintainer").catch(() => false)) ||
    (await CheckPermission(user.id, "admin").catch(() => false));

  const { data: report } = await supabase.from("report").select("user_id").eq("id", id).maybeSingle();
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
  if (!canSeeAll && report.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden — only owner or maintainer may view comments" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("report_comment")
    .select("id, report_id, user_id, comment, date_added")
    .eq("report_id", id)
    .order("date_added", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Enrich with username for maintainers
  if (canSeeAll && data && data.length > 0) {
    const ids = [...new Set(data.map((c) => c.user_id).filter(Boolean))] as string[];
    if (ids.length > 0) {
      const { data: users } = await supabase.from("users").select("id, username").in("id", ids);
      const map = new Map(users?.map((u) => [u.id, u.username]) ?? []);
      const enriched = data.map((c) => ({
        ...c,
        username: c.user_id ? (map.get(c.user_id) ?? null) : null,
        displayName: c.user_id ? (map.get(c.user_id) ?? c.user_id.slice(0, 8)) : "Guest",
      }));
      return NextResponse.json(enriched);
    }
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 });

  const canSeeAll =
    (await CheckPermission(user.id, "maintainer").catch(() => false)) ||
    (await CheckPermission(user.id, "admin").catch(() => false));

  const { data: report } = await supabase.from("report").select("id, user_id, done").eq("id", id).maybeSingle();
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
  if (!canSeeAll && report.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden — you can only comment on your own reports" }, { status: 403 });
  }
  if (report.done === true && !canSeeAll) {
    return NextResponse.json({ error: "Report is marked done — closed for comments" }, { status: 403 });
  }

  let body: { comment?: string };
  try {
    const ct = request.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      body = await request.json();
    } else {
      const fd = await request.formData();
      body = { comment: String(fd.get("comment") ?? "") };
    }
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const comment = (body.comment ?? "").trim();
  if (!comment) return NextResponse.json({ error: "comment is required" }, { status: 400 });
  if (comment.length > 2000) return NextResponse.json({ error: "comment too long (max 2000 chars)" }, { status: 400 });

  const { data, error } = await supabase
    .from("report_comment")
    .insert({ report_id: id, user_id: user.id, comment } as never)
    .select("id, report_id, user_id, comment, date_added")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
