import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import CheckPermission from "@/lib/roles";
import { report_types } from "@/lib/report-types";

export const dynamic = "force-dynamic";

type ReportTypeKey = keyof typeof report_types;

function isValidType(t: string): t is ReportTypeKey {
  return Object.prototype.hasOwnProperty.call(report_types, t);
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to view reports." }, { status: 401 });
  }

  const canSeeAll =
    (await CheckPermission(user.id, "maintainer").catch(() => false)) ||
    (await CheckPermission(user.id, "admin").catch(() => false));

  const url = request.nextUrl;
  const tab = url.searchParams.get("tab"); // all | pending | done
  const type = url.searchParams.get("type");

  let query = supabase
    .from("report")
    .select("id, user_id, title, content, type, report_source, unauth_email, done");

  if (!canSeeAll) {
    query = query.eq("user_id", user.id);
  }
  if (type) query = query.eq("type", type);

  if (tab === "pending") query = query.or("done.is.null,done.eq.false");
  else if (tab === "done") query = query.eq("done", true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  let body: {
    type?: string;
    title?: string;
    content?: string;
    unauth_email?: string;
    report_source?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const typeRaw = (body.type ?? "").trim();
  const title = (body.title ?? "").trim();
  const content = (body.content ?? "").trim();
  const unauth_email = (body.unauth_email ?? "").trim();
  const report_source = body.report_source ? String(body.report_source).trim() : null;

  if (!typeRaw || !title || !content) {
    return NextResponse.json({ error: "type, title, and content are required." }, { status: 400 });
  }
  if (!isValidType(typeRaw)) {
    return NextResponse.json({ error: "Invalid report type." }, { status: 400 });
  }

  const meta = report_types[typeRaw];

  // Public gating: public:false requires authentication
  if (!meta.public && !isAuthenticated) {
    return NextResponse.json({ error: `Report type "${meta.name}" requires sign-in.` }, { status: 403 });
  }

  // For guests, unauth_email required and must be valid
  if (!isAuthenticated) {
    if (!unauth_email) {
      return NextResponse.json({ error: "Email is required for guest reports." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(unauth_email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
  }

  if (title.length > 200) {
    return NextResponse.json({ error: "Title too long (max 200 chars)." }, { status: 400 });
  }
  if (report_source && report_source.length > 2000) {
    return NextResponse.json({ error: "Source link too long." }, { status: 400 });
  }
  // Optional URL validation for report_source if provided as URL
  if (report_source && /^https?:\/\//.test(report_source) && !/^https?:\/\/.+/.test(report_source)) {
    return NextResponse.json({ error: "Invalid source URL." }, { status: 400 });
  }

  const id = crypto.randomUUID();

  const row: Record<string, unknown> = {
    id,
    title,
    content,
    type: typeRaw,
    report_source: report_source ? { url: report_source } : null,
    done: false,
  };

  if (isAuthenticated && user) {
    row.user_id = user.id;
    row.unauth_email = null;
  } else {
    row.user_id = null;
    row.unauth_email = unauth_email;
  }

  const { data, error } = await supabase.from("report").insert(row).select("id").maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data?.id ?? id }, { status: 201 });
}
