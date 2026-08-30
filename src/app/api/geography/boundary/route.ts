import axios from "axios";
import { NextResponse } from "next/server";
import { cached } from "@/lib/cache";
import type { NominatimLookupResponse } from "@/types/map";

const LUCENA_OSM_RELATION = "R11124741";

export const revalidate = 86_400;

export async function GET() {
  try {
    const place = await cached(
      `nominatim:boundary:${LUCENA_OSM_RELATION}`,
      86_400,
      async () => {
        const url =
          `https://nominatim.openstreetmap.org/lookup?osm_ids=${LUCENA_OSM_RELATION}` +
          "&format=json&polygon_geojson=1";

        const results = (
          await axios.get<NominatimLookupResponse[]>(url, {
            headers: {
              Accept: "application/json",
              "User-Agent": "BetterGov.ph Lucena City portal (civic tech, non-commercial)",
            },
            timeout: 15_000,
          })
        ).data;

        const found = results[0];
        if (!found?.geojson) {
          throw new Error("Boundary not found for Lucena City.");
        }
        return found;
      }
    );

    if (!place?.geojson) {
      return NextResponse.json(
        { error: "Boundary not found for Lucena City." },
        { status: 404 }
      );
    }

    const [south, north, west, east] = place.boundingbox;

    return NextResponse.json({
      source: "OpenStreetMap via Nominatim",
      attributionUrl: "https://www.openstreetmap.org/copyright",
      osmRelationId: Number(LUCENA_OSM_RELATION.slice(1)),
      displayName: place.display_name,
      center: { latitude: Number(place.lat), longitude: Number(place.lon) },
      bounds: {
        south: Number(south),
        north: Number(north),
        west: Number(west),
        east: Number(east),
      },
      boundary: place.geojson,
    }, {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Boundary fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to load Lucena City boundary. Try again later." },
      { status: 502 }
    );
  }
}
