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

  const allowed = await CheckPermission(user.id, "maintainer");
  if (!allowed) {
    return NextResponse.json(
      { error: "Forbidden — you must be an approved Maintainer or Head Maintainer." },
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

  // Maintainers can only restrict, not unrestrict
  if (body.restricted === false) {
    return NextResponse.json(
      { error: "Maintainers can only restrict users, not unrestrict. Contact a Head Maintainer to unrestrict." },
      { status: 403 }
    );
  }

  if (id === user.id) {
    return NextResponse.json({ error: "You cannot restrict yourself." }, { status: 400 });
  }

  const { data: target, error: fetchError } = await supabase
    .from("users")
    .select("id, user_type, restricted")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Prevent maintainers from restricting Head Maintainers
  if (target.user_type === "Head Maintainer") {
    return NextResponse.json(
      { error: "Cannot restrict a Head Maintainer." },
      { status: 403 }
    );
  }

  if (target.restricted === true) {
    return NextResponse.json({ error: "User is already restricted." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .update({ restricted: true })
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
