// INFO: Lucena Map Boundary
export interface BoundaryData {
  displayName: string;
  center: { latitude: number; longitude: number };
  bounds: {
    south: number;
    north: number;
    west: number;
    east: number;
  };
  boundary: {
    type: "Polygon" | "MultiPolygon";
    coordinates: unknown;
  };
}

export interface NominatimLookupResponse {
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
