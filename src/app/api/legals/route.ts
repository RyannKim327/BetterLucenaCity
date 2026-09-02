import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LEGAL_DOC_TYPES } from "@/types/legal";
import { isLegalDocType } from "@/lib/data/legal-documents";
import type { LegalDocument } from "@/types/legal";

export const dynamic = "force-dynamic";

const legalDisclaimer =
  "City-level entries below are compiled from official public records and published session reports of the Sangguniang Panlungsod of Lucena. National laws listed are verifiable public statutes. Where a document's official text is not yet available online, the entry is marked 'pending verification' pending confirmation against the records of the Sangguniang Panlungsod.";

interface LegalRow {
  id: number;
  title: string;
  content: string | null;
  summary: string | null;
  reference: string | null;
  resolution_number: string | null;
  ordinance_type: string | null;
  proclamation_date: string | null;
  approved_by: string | null;
  source_url: string | null;
  source_name: string | null;
}

function toLegalDocument(row: LegalRow): LegalDocument {
  return {
    id: String(row.id),
    type: (row.ordinance_type as LegalDocument["type"]) ?? "city_ordinance",
    number: row.reference ?? row.resolution_number ?? "",
    title: row.title,
    date: row.proclamation_date ?? null,
    summary: row.summary ?? row.content ?? "",
    sourceUrl: row.source_url ?? undefined,
    sourceName: row.source_name ?? undefined,
    verification: row.approved_by !== null,
  };
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get("type");

  if (type && !isLegalDocType(type)) {
    return NextResponse.json(
      { error: "Invalid document type", allowed: LEGAL_DOC_TYPES.map((t) => t.id) },
      { status: 400 }
    );
  }

  const supa = await createClient();
  let query = supa.from("legals").select("*");

  if (type) query = query.eq("ordinance_type", type);

  const { data, error } = await query.order("proclamation_date", {
    ascending: false,
    nullsFirst: false,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message, documents: [], totalByType: {}, total: 0 },
      { status: 500 }
    );
  }

  const rows = (data ?? []) as LegalRow[];
  const documents = rows.map(toLegalDocument);

  const countsByType = Object.fromEntries(
    LEGAL_DOC_TYPES.map((t) => [
      t.id,
      rows.filter((r) => r.ordinance_type === t.id).length,
    ])
  );

  return NextResponse.json({
    locality: "Lucena City, Quezon",
    disclaimer: legalDisclaimer,
    total: documents.length,
    totalByType: countsByType,
    types: LEGAL_DOC_TYPES,
    documents,
  });
}
