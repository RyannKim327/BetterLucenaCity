import { NextRequest, NextResponse } from "next/server";
import {
  LEGAL_DOC_TYPES,
  legalDisclaimer,
  legalDocuments,
  isLegalDocType,
  type LegalDocType,
} from "@/lib/data/legal-documents";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get("type");
  const year = params.get("year");
  const q = params.get("q")?.toLowerCase().trim();

  if (type && !isLegalDocType(type)) {
    return NextResponse.json(
      { error: "Invalid document type", allowed: LEGAL_DOC_TYPES.map((t) => t.id) },
      { status: 400 }
    );
  }

  if (year && !/^\d{4}$/.test(year)) {
    return NextResponse.json(
      { error: "Year must be a four-digit value, e.g. 1991." },
      { status: 400 }
    );
  }

  let documents = [...legalDocuments];

  if (type) documents = documents.filter((d) => d.type === (type as LegalDocType));
  if (year)
    documents = documents.filter((d) => d.date?.startsWith(year));
  if (q)
    documents = documents.filter((d) =>
      [d.number, d.title, d.summary].join(" ").toLowerCase().includes(q)
    );

  const countsByType = Object.fromEntries(
    LEGAL_DOC_TYPES.map((t) => [
      t.id,
      legalDocuments.filter((d) => d.type === t.id).length,
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
