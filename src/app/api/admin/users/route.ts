import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import CheckPermission from "@/lib/roles";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const allowed = await CheckPermission(user.id, "admin");
  if (!allowed) {
    return NextResponse.json(
      {
        error:
          "Forbidden — you must be an approved Head Maintainer to view all users.",
      },
      { status: 403 }
    );
  }

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();

  let query = supabase
    .from("users")
    .select("id, username, email, avatar_url, user_type, approved, restricted, date_added")
    .order("date_added", { ascending: false })
    .limit(200);

  if (q) {
    // Escape commas and use ilike on username and email
    // Supabase .or() expects syntax like 'username.ilike.%query%,email.ilike.%query%'
    // Need to escape % and _? keep simple
    const sanitized = q.replace(/[%\\]/g, "").replace(/,/g, "");
    if (sanitized) {
      query = query.or(`username.ilike.%${sanitized}%,email.ilike.%${sanitized}%`);
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
