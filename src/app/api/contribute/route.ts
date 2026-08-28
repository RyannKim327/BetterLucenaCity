import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ContributePayload {
  category?: string;
  title?: string;
  source?: string;
  details?: string;
  consent?: boolean;
}

const VALID_CATEGORIES = [
  "Announcement",
  "Service Information",
  "Budget / Project",
  "Transparency Data",
  "Other",
];

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "You must be signed in to contribute." },
      { status: 401 },
    );
  }

  let body: ContributePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const category = (body.category ?? "").trim();
  const title = (body.title ?? "").trim();
  const details = (body.details ?? "").trim();

  if (!category || !title || !details) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  if (body.source && !/^https?:\/\/.+/.test(body.source.trim())) {
    return NextResponse.json(
      { error: "Source link must be a valid URL." },
      { status: 400 },
    );
  }

  if (!body.consent) {
    return NextResponse.json(
      { error: "Consent is required to submit a contribution." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
