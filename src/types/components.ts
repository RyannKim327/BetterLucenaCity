

// INFO: Live Data
export interface WeatherData {
  current: {
    temperatureC: number;
    humidityPct: number;
    windSpeedKph: number;
    label: string;
    icon: string;
  };
  daily: Array<{
    date: string;
    maxTempC: number;
    minTempC: number;
    rainProbabilityPct: number;
    icon: string;
  }>;
}

export interface EarthquakeData {
  location: string;
  earthquakes: Array<{
    date_time: string
    latitude: number
    longitude: number
    depth_km: number
    magnitude: number
    location: string,
    details_link: string
  }>;
}

export interface DpwhData {
  scope: string;
  summary: {
    totalProjects: number;
    completed: number;
    ongoing: number;
    forProcurement: number;
    totalBudget: number;
  };
  projects: Array<{
    contractId: string;
    description: string;
    status: string;
    budget: number;
    infraYear: string;
  }>;
}

export type PanelState<T> = { status: "loading" } | { status: "error" } | { status: "ready"; data: T };

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


// INFO: Page Headers
export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}


