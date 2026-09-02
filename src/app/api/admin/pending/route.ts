import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import CheckPermission from "@/lib/roles";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const allowed = await CheckPermission(user.id, "admin");
  if (!allowed)
    return NextResponse.json(
      {
        error:
          "Forbidden — you must be an approved Head Maintainer or Maintainer. If this is the first admin, set your user_type to 'Head Maintainer' and approved=true manually in Supabase Studio.",
      },
      { status: 403 }
    );

  const { data, error } = await supabase
    .from("users")
    .select("id, username, email, avatar_url, user_type, approved, date_added")
    .eq("approved", false)
    .order("date_added", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
