import { NextResponse, after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import CheckPermission from "@/lib/roles";
import sendEmail from "@/lib/email-send";
import { notifyAccount } from "@/lib/notifications";

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
    .select("id, approved, email, username, user_type")
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

  if (data.approved) {
    await sendEmail({
      subject: "Account Approval",
      email: data.email,
      content: `Greetings ${data.username}! The administrators of Better Lucena City approved your request to join with us as ${data.user_type}. Please follow the rules and regulation to prevent the suspension of your account.`
    })
  } else {
    await sendEmail({
      subject: "Account Notice",
      email: data.email,
      content: `Greetings ${data.username}! The administrators of Better Lucena City decided to decline your request due to some reasons. If you think this is a mistake, please contact us on facebook.com/BetterLucenaCity.org alongside with the screenshot of registration and reason why you want to be part of Better Lucena City.`
    })
  }

  after(async () => {
    await notifyAccount(supabase, data.id, {
      title: data.approved ? "Account approved" : "Account request declined",
      body: data.approved
        ? `You can now contribute as ${data.user_type}. Welcome to Better Lucena City!`
        : "Your request was declined. Contact the maintainers if you think this is a mistake.",
      href: "/user",
    })
  })

  return NextResponse.json({ ok: true, id: data.id, approved: data.approved });
}
