import { EarthquakeResponse } from "@/types/live-data";
import { LUCENA, fetchJson } from "./shared";

export async function getEarthquakes(radiusKm = 200) {
  const radius = Math.min(Math.max(radiusKm, 10), 500);
  const json = await fetchJson<EarthquakeResponse>(
    `https://earthquakeapi.forestparty223.workers.dev/api/earthquakes`,
    200
  );

  return {
    source: "PHIVOLCS LATEST EARTHQUAKE INFORMATION",
    attributionUrl: "https://earthquakeapi.forestparty223.workers.dev/api/earthquakes",
    location: `Within ${radius} km of ${LUCENA.name}`,
    earthquakes: json,
  };
}
