import { NextResponse } from "next/server";
import { LEGAL_DOC_TYPES } from "@/types/legal";

export function GET() {
  return NextResponse.json(LEGAL_DOC_TYPES);
}
