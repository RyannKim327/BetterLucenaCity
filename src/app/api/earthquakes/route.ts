import { NextRequest, NextResponse } from "next/server";
import { getEarthquakes } from "@/lib/sources/earthquakes";

export async function GET(request: NextRequest) {
  const radiusParam = request.nextUrl.searchParams.get("radius");
  const radius = Number(radiusParam);

  if (radiusParam && (!Number.isFinite(radius) || radius < 10 || radius > 500)) {
    return NextResponse.json(
      { error: "Radius must be a number between 10 and 500 kilometers." },
      { status: 400 }
    );
  }

  try {
    const data = await getEarthquakes(Number.isFinite(radius) ? radius : 200);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=600, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("Earthquake fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to reach USGS earthquake source. Try again later." },
      { status: 502 }
    );
  }
}
