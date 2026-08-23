import { LUCENA, fetchJson } from "./shared";

interface UsgsResponse {
  features: Array<{
    id: string;
    properties: {
      mag: number | null;
      place: string;
      time: number;
      url: string;
      tsunami: number;
      magType: string | null;
    };
    geometry: {
      coordinates: [number, number, number];
    };
  }>;
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const a =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lon2 - lon1) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function getEarthquakes(radiusKm = 200) {
  const radius = Math.min(Math.max(radiusKm, 10), 500);
  const params = new URLSearchParams({
    latitude: String(LUCENA.latitude),
    longitude: String(LUCENA.longitude),
    maxradiuskm: String(radius),
    format: "geojson",
    orderby: "time",
    limit: "10",
    starttime: new Date(Date.now() - 90 * 86_400_000).toISOString().slice(0, 10),
  });

  const json = await fetchJson<UsgsResponse>(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`,
    600
  );

  return {
    source: "USGS Earthquake Hazards Program",
    attributionUrl: "https://earthquake.usgs.gov/",
    location: `Within ${radius} km of ${LUCENA.name}`,
    earthquakes: json.features.map((f) => ({
      id: f.id,
      magnitude: f.properties.mag,
      magType: f.properties.magType,
      place: f.properties.place,
      time: new Date(f.properties.time).toISOString(),
      depthKm: Math.round(f.geometry.coordinates[2]),
      distanceFromLucenaKm: Math.round(
        haversineKm(
          LUCENA.latitude,
          LUCENA.longitude,
          f.geometry.coordinates[1],
          f.geometry.coordinates[0]
        )
      ),
      url: f.properties.url,
      coordinates: {
        latitude: f.geometry.coordinates[1],
        longitude: f.geometry.coordinates[0],
      },
    })),
  };
}
