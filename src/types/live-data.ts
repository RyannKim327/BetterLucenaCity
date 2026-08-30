// INFO: Live data panel state
export type PanelState<T> =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: T };

// INFO: Weather
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

export interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
  };
}

// INFO: Earthquakes
export interface EarthquakeData {
  location: string;
  earthquakes: Array<{
    date_time: string
    latitude: number
    longitude: number
    depth_km: number
    magnitude: number
    location: string
    details_link: string
  }>;
}

export interface EarthquakeResponse {
  features: Array<{
    date_time: string
    latitude: number
    longitude: number
    depth_km: number
    magnitude: number
    location: string
    details_link: string
  }>;
}

// INFO: DPWH
export interface DpwhProject {
  contractId: string;
  description: string;
  category: string;
  status: string;
  budget: number;
  amountPaid: number;
  progress: number;
  location: { province: string; region: string };
  contractor: string;
  startDate: string | null;
  completionDate: string | null;
  infraYear: string;
  programName: string;
  sourceOfFunds: string;
  latitude: number | null;
  longitude: number | null;
}

export interface DpwhResponse {
  status: number;
  code: string;
  data: {
    data: DpwhProject[];
    summary: {
      totalProjects: number;
      completed: number;
      ongoing: number;
      notStarted: number;
      forProcurement: number;
      terminated: number;
      totalBudget: number;
    };
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface DpwhQuery {
  search?: string;
  status?: string;
  year?: string;
  limit?: number;
  page?: number;
  scopeAll?: boolean;
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
