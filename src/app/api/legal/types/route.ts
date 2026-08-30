import { NextRequest, NextResponse } from "next/server";
import { LEGAL_DOC_TYPES } from "@/types/sources";

export function GET(request: NextRequest) {
  return NextResponse.json(LEGAL_DOC_TYPES);
}
