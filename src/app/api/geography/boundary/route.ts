import { NextResponse } from "next/server";

const LUCENA_OSM_RELATION = "R11124741";

interface NominatimLookupResponse {
  place_id: number;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: [string, string, string, string];
  geojson: {
    type: "Polygon" | "MultiPolygon";
    coordinates: unknown;
  };
}

export async function GET() {
  try {
    const url =
      `https://nominatim.openstreetmap.org/lookup?osm_ids=${LUCENA_OSM_RELATION}` +
      "&format=json&polygon_geojson=1";

    const results = (await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "BetterGov.ph Lucena City portal (civic tech, non-commercial)",
      },
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(15_000),
    }).then((res) => {
      if (!res.ok) throw new Error(`Nominatim responded ${res.status}`);
      return res.json();
    })) as NominatimLookupResponse[];

    const place = results[0];
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
    });
  } catch (error) {
    console.error("Boundary fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to load Lucena City boundary. Try again later." },
      { status: 502 }
    );
  }
}
