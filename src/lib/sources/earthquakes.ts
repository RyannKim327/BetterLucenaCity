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

export async function getEarthquakes(radiusKm = 200) {
  const radius = Math.min(Math.max(radiusKm, 10), 500);
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
