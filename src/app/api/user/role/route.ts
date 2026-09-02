import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SELF_SELECT_ROLES } from "@/lib/role-options";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  let body: { role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const requested = (body.role ?? "").trim();
  if (!requested) {
    return NextResponse.json({ error: "Please choose a role." }, { status: 400 });
  }

  if (!SELF_SELECT_ROLES.includes(requested as typeof SELF_SELECT_ROLES[number])) {
    return NextResponse.json(
      { error: `Invalid role. Allowed: ${SELF_SELECT_ROLES.join(", ")}` },
      { status: 400 }
    );
  }

  // Fetch current profile to prevent privilege escalation after already set,
  // and to enforce approved=false reset on role change.
  const { data: existing, error: fetchError } = await supabase
    .from("users")
    .select("user_type, approved")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  // If user already has an approved role, disallow self-re-selection
  // (maintainers can re-assign via admin). Allow only when pending or null.
  if (existing?.approved === true && existing?.user_type) {
    return NextResponse.json(
      { error: "You already have an approved role. Contact a Maintainer to change it." },
      { status: 403 }
    );
  }

  // If they already selected the same role and are pending, just return ok
  const { error: updateError } = await supabase
    .from("users")
    .update({ user_type: requested, approved: false })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, role: requested, approved: false });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data, error } = await supabase
    .from("users")
    .select("user_type, approved")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
