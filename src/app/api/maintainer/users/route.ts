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

  const allowed = await CheckPermission(user.id, "maintainer");
  if (!allowed) {
    return NextResponse.json(
      {
        error:
          "Forbidden — you must be an approved Maintainer or Head Maintainer to view users.",
      },
      { status: 403 }
    );
  }

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();

  let query = supabase
    .from("users")
    .select("id, username, email, avatar_url, user_type, approved, restricted, date_added")
    .not("restricted", "is", true)
    .order("date_added", { ascending: false })
    .limit(200);

  if (q) {
    const sanitized = q.replace(/[%\\]/g, "").replace(/,/g, "");
    if (sanitized) {
      query = query.or(`username.ilike.%${sanitized}%,email.ilike.%${sanitized}%`);
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Hide Head Maintainers from maintainer view
  const filtered = (data ?? []).filter((u) => u.user_type !== "Head Maintainer");

  return NextResponse.json(filtered);
}
