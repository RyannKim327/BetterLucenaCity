import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ContributePayload } from "@/types/contribute";

const VALID_CATEGORIES = [
  "Announcement",
  "Service Information",
  "Budget / Project",
  "Transparency Data",
  "Data Verification / Correction",
  "Report / Document",
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

  if (
    body.supportingDocument &&
    body.supportingDocument.trim().length > 0 &&
    /^https?:\/\//.test(body.supportingDocument.trim()) &&
    !/^https?:\/\/.+/.test(body.supportingDocument.trim())
  ) {
    return NextResponse.json(
      { error: "Supporting document link must be a valid URL." },
      { status: 400 },
    );
  }

  // Encourage reliable source + supporting document for transparency reports.
  // We keep it soft-validation here — the Data Validator will hold submissions
  // without verifiable reference until validated. See CONTRIBUTING.md.
  if (!body.consent) {
    return NextResponse.json(
      { error: "Consent is required — confirm the report is from a reliable source and includes supporting documents where possible." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
