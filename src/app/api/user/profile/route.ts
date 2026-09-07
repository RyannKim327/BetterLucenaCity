import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data, error } = await supabase
    .from("users")
    .select("id, email, first_name, last_name, username, avatar_url, user_type, approved, show_contributor, show_picture, date_added")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let body: {
    first_name?: string;
    last_name?: string;
    username?: string;
    show_contributor?: boolean;
    show_picture?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (body.first_name !== undefined) {
    const v = body.first_name.trim();
    if (v.length > 50) return NextResponse.json({ error: "First name must be 50 characters or fewer." }, { status: 400 });
    updates.first_name = v || null;
  }
  if (body.last_name !== undefined) {
    const v = body.last_name.trim();
    if (v.length > 50) return NextResponse.json({ error: "Last name must be 50 characters or fewer." }, { status: 400 });
    updates.last_name = v || null;
  }
  if (body.username !== undefined) {
    const v = body.username.trim();
    if (!v) return NextResponse.json({ error: "Username is required." }, { status: 400 });
    if (v.length < 3 || v.length > 24) return NextResponse.json({ error: "Username must be 3–24 characters." }, { status: 400 });
    if (!/^[a-zA-Z0-9._-]+$/.test(v)) return NextResponse.json({ error: "Username may only contain letters, numbers, dot, underscore, or hyphen." }, { status: 400 });
    updates.username = v;
  }
  if (body.show_contributor !== undefined) {
    updates.show_contributor = !!body.show_contributor;
  }
  if (body.show_picture !== undefined) {
    updates.show_picture = !!body.show_picture;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id)
    .select("id, email, first_name, last_name, username, avatar_url, user_type, approved, show_contributor, show_picture")
    .maybeSingle();

  if (error) {
    // Unique violation on username
    if (error.code === "23505") {
      return NextResponse.json({ error: "Username is already taken." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
