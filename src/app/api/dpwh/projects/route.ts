import { NextRequest, NextResponse } from "next/server";
import { getDpwhProjects } from "@/lib/sources/dpwh";

const ALLOWED_STATUSES = new Set([
  "Completed",
  "Ongoing",
  "Not Started",
  "For Procurement",
  "Terminated",
]);

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const status = params.get("status") ?? undefined;

  if (status && !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json(
      {
        error: "Invalid status filter",
        allowed: [...ALLOWED_STATUSES],
      },
      { status: 400 }
    );
  }

  try {
    const data = await getDpwhProjects({
      search: params.get("search") ?? undefined,
      status,
      year: params.get("year") ?? undefined,
      limit: Number(params.get("limit")) || undefined,
      page: Number(params.get("page")) || undefined,
      scopeAll: params.get("scope") === "national",
    });
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=900, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("DPWH fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to reach DPWH transparency source. Try again later." },
      { status: 502 }
    );
  }
}
