import { LUCENA, fetchJson } from "./shared";

const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Rime fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy drizzle", icon: "🌧️" },
  61: { label: "Light rain", icon: "🌦️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  80: { label: "Rain showers", icon: "🌦️" },
  81: { label: "Rain showers", icon: "🌧️" },
  82: { label: "Violent showers", icon: "⛈️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" },
  99: { label: "Thunderstorm with hail", icon: "⛈️" },
};

interface OpenMeteoResponse {
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

export async function getWeather() {
  const params = new URLSearchParams({
    latitude: String(LUCENA.latitude),
    longitude: String(LUCENA.longitude),
    current:
      "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum",
    timezone: "Asia/Manila",
    forecast_days: "4",
  });

  const json = await fetchJson<OpenMeteoResponse>(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    600
  );

  const describe = (code: number) => WMO_CODES[code] ?? { label: "Unknown", icon: "🌡️" };

  return {
    source: "Open-Meteo",
    attributionUrl: "https://open-meteo.com/",
    location: LUCENA.name,
    current: {
      time: json.current.time,
      temperatureC: json.current.temperature_2m,
      humidityPct: json.current.relative_humidity_2m,
      precipitationMm: json.current.precipitation,
      windSpeedKph: Math.round(json.current.wind_speed_10m),
      windGustKph: Math.round(json.current.wind_gusts_10m),
      ...describe(json.current.weather_code),
    },
    daily: json.daily.time.map((date, i) => ({
      date,
      maxTempC: json.daily.temperature_2m_max[i],
      minTempC: json.daily.temperature_2m_min[i],
      rainProbabilityPct: json.daily.precipitation_probability_max[i],
      rainSumMm: json.daily.precipitation_sum[i],
      ...describe(json.daily.weather_code[i]),
    })),
  };
}
