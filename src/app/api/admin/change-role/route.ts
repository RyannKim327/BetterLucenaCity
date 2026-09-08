import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import CheckPermission from "@/lib/roles";

// Admin-only: change user_type (e.g., Tester -> Maintainer)
// Must NOT allow Head Maintainer as target value
const ALLOWED_ROLES = ["Maintainer", "Data Collaborator", "Data Validator", "Tester"] as const;
type AllowedRole = typeof ALLOWED_ROLES[number];

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
      { error: "Forbidden — you must be an approved Head Maintainer to change roles." },
      { status: 403 }
    );
  }

  let body: { id?: string; user_type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const id = (body.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  const requested = (body.user_type ?? "").trim();
  if (!requested) {
    return NextResponse.json({ error: "Missing user_type" }, { status: 400 });
  }

  // Normalize: ensure title case match? We accept exact allowed values
  if (!ALLOWED_ROLES.includes(requested as AllowedRole)) {
    return NextResponse.json(
      {
        error: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}. Head Maintainer assignment is not allowed via this endpoint.`,
      },
      { status: 400 }
    );
  }

  if (id === user.id) {
    return NextResponse.json({ error: "You cannot change your own role via this endpoint." }, { status: 400 });
  }

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

  // Optional: prevent changing a Head Maintainer's role (protect Head Maintainers)
  if (target.user_type === "Head Maintainer") {
    return NextResponse.json(
      { error: "Cannot change the role of a Head Maintainer." },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("users")
    .update({ user_type: requested })
    .eq("id", id)
    .select("id, user_type")
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

  return NextResponse.json({ ok: true, id: data.id, user_type: data.user_type });
}
