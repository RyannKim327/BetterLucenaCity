import { LUCENA, fetchJson } from "./shared";

interface UsgsResponse {
  features: Array<{
    date_time: string
    latitude: number
    longitude: number
    depth_km: number
    magnitude: number
    location: string,
    details_link: string
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
    `https://earthquakeapi.forestparty223.workers.dev/api/earthquakes`,
    600
  );

  return {
    source: "PHIVOLCS LATEST EARTHQUAKE INFORMATION",
    attributionUrl: "https://earthquakeapi.forestparty223.workers.dev/api/earthquakes",
    location: `Within ${radius} km of ${LUCENA.name}`,
    earthquakes: json,
  };
}
