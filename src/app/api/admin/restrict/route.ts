import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import CheckPermission from "@/lib/roles";

export async function POST(request: Request) {
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
      { error: "Forbidden — you must be an approved Head Maintainer." },
      { status: 403 }
    );
  }

  let body: { id?: string; restricted?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const id = (body.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  if (typeof body.restricted !== "boolean") {
    return NextResponse.json({ error: "restricted must be boolean" }, { status: 400 });
  }

  if (id === user.id) {
    return NextResponse.json({ error: "You cannot restrict/unrestrict yourself." }, { status: 400 });
  }

  // Optional: prevent restricting Head Maintainers? Allow admin to restrict anyone except Head Maintainer self-protection
  // Check target's current type to optionally block Head Maintainer restriction
  const { data: target, error: fetchError } = await supabase
    .from("users")
    .select("id, user_type")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Protection: disallow restricting another Head Maintainer unless you are Head Maintainer? Admin already is Head Maintainer, so allow but give warning?
  // We allow but we could block to avoid accidental lockout - currently we allow.

  const { data, error } = await supabase
    .from("users")
    .update({ restricted: body.restricted })
    .eq("id", id)
    .select("id, restricted")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "No rows updated — RLS blocked the update or user not found." },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true, id: data.id, restricted: data.restricted });
}
