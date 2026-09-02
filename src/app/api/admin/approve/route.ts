import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import CheckPermission from "@/lib/roles";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not signed in" },
      { status: 401 }
    );
  }

  const allowed = await CheckPermission(user.id, "admin");

  if (!allowed) {
    return NextResponse.json(
      {
        error:
          "Forbidden — you must be an approved Head Maintainer or Maintainer. If this is the first admin, set your user_type to 'Head Maintainer' and approved=true manually in Supabase Studio, then retry.",
      },
      { status: 403 }
    );
  }

  let body: { id?: string; approved?: boolean };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid body" },
      { status: 400 }
    );
  }

  const id = (body.id ?? "").trim();

  if (!id) {
    return NextResponse.json(
      { error: "Missing user id" },
      { status: 400 }
    );
  }


  // Use .select() to detect RLS-filtered 0-row updates (Supabase returns no error but empty data when RLS blocks)
  const { data, error } = await supabase
    .from("users")
    .update({ approved: true })
    .eq("id", id)
    .select("id, approved")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      {
        error:
          "No rows updated — RLS blocked the update. Ensure you are signed in as an approved Head Maintainer / Maintainer (CheckPermission admin). If this is the first admin, set approved=true manually in Supabase Studio. Also check that the target id exists.",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true, id: data.id, approved: data.approved });
}
