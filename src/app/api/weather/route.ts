import { NextResponse } from "next/server";
import { getWeather } from "@/lib/sources/weather";

export async function GET() {
  try {
    const data = await getWeather();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Weather fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to reach weather source. Try again later." },
      { status: 502 }
    );
  }
}
