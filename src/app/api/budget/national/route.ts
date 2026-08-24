import { NextResponse } from "next/server";
import { getNationalBudget } from "@/lib/sources/budget";

export async function GET() {
  try {
    const data = await getNationalBudget();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Budget fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to reach the PH Budget Data API. Try again later." },
      { status: 502 }
    );
  }
}
