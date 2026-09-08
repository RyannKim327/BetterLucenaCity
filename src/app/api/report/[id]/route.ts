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

  const { data: report, error } = await supabase
    .from("report")
    .select("id, user_id, title, content, type, report_source, unauth_email, done")
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  // Guests and non-maintainers may only view their own reports
  if (!user) {
    return NextResponse.json({ error: "You must be signed in to view this report." }, { status: 401 });
  }

  const canSeeAll =
    (await CheckPermission(user.id, "maintainer").catch(() => false)) ||
    (await CheckPermission(user.id, "admin").catch(() => false));

  if (!canSeeAll && report.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden — you can only view your own reports" }, { status: 403 });
  }

  const { data: comments } = await supabase
    .from("report_comment")
    .select("id, report_id, user_id, comment, date_added")
    .eq("report_id", id)
    .order("date_added", { ascending: true });

  return NextResponse.json({ report, comments: comments ?? [] });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 });

  const canSeeAll =
    (await CheckPermission(user.id, "maintainer").catch(() => false)) ||
    (await CheckPermission(user.id, "admin").catch(() => false));
  if (!canSeeAll) return NextResponse.json({ error: "Forbidden — maintainer permission required" }, { status: 403 });

  let body: { done?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.done !== "boolean") {
    return NextResponse.json({ error: "done (boolean) is required" }, { status: 400 });
  }

  const { data, error } = await supabase.from("report").update({ done: body.done }).eq("id", id).select("id, done").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
