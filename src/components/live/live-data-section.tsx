"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface WeatherData {
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

interface EarthquakeData {
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

interface DpwhData {
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

type PanelState<T> = { status: "loading" } | { status: "error" } | { status: "ready"; data: T };

function formatPeso(n: number) {
  return n >= 1_000_000_000
    ? `₱${(n / 1_000_000_000).toFixed(1)}B`
    : n >= 1_000_000
      ? `₱${(n / 1_000_000).toFixed(1)}M`
      : `₱${n.toLocaleString()}`;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-outline-variant/40 bg-surface-container-low p-5 shadow-elevation-1">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">{title}</h3>
      <div className="mt-4 text-sm">{children}</div>
    </div>
  );
}

function Loading({ label }: { label: string }) {
  return (
    <div role="status" className="animate-pulse space-y-2">
      <p className="text-on-surface-variant">Loading {label}…</p>
    </div>
  );
}

function Failed() {
  return <p className="text-red-600 dark:text-red-400">Unavailable right now. Please try again later.</p>;
}

type ApiError = { error: string };

export function LiveDataSection() {
  const [weather, setWeather] = useState<PanelState<WeatherData>>({ status: "loading" });
  const [quakes, setQuakes] = useState<PanelState<EarthquakeData>>({ status: "loading" });
  const [dpwh, setDpwh] = useState<PanelState<DpwhData>>({ status: "loading" });

  useEffect(() => {
    axios
      .get<WeatherData | ApiError>("/api/weather")
      .then((res) =>
        "error" in res.data ? setWeather({ status: "error" }) : setWeather({ status: "ready", data: res.data })
      )
      .catch(() => setWeather({ status: "error" }));

    axios
      .get<EarthquakeData | ApiError>("/api/earthquakes", { params: { radius: 200 } })
      .then((res) =>
        "error" in res.data ? setQuakes({ status: "error" }) : setQuakes({ status: "ready", data: res.data })
      )
      .catch(() => setQuakes({ status: "error" }));

    axios
      .get<DpwhData | ApiError>("/api/dpwh/projects", { params: { limit: 6, status: "Ongoing" } })
      .then((res) =>
        "error" in res.data ? setDpwh({ status: "error" }) : setDpwh({ status: "ready", data: res.data })
      )
      .catch(() => setDpwh({ status: "error" }));
  }, []);

  return (
    <section aria-labelledby="live-data-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 id="live-data-heading" className="text-2xl font-semibold tracking-tight">
        Live Civic Data
      </h2>
      {/*<p className="mt-1 text-on-surface-variant">
        Real-time feeds from national agencies, served through our own API.
      </p> */}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Panel title="Weather · Lucena City">
          {weather.status === "loading" && <Loading label="weather" />}
          {weather.status === "error" && <Failed />}
          {weather.status === "ready" && (
            <div>
              <p className="flex items-baseline gap-2">
                <span aria-hidden className="text-3xl">{weather.data.current.icon}</span>
                <span className="text-3xl font-semibold">{Math.round(weather.data.current.temperatureC)}°C</span>
              </p>
              <p className="mt-1 text-on-surface-variant">{weather.data.current.label}</p>
              <p className="mt-1 text-xs text-on-surface-variant">
                Humidity {weather.data.current.humidityPct}% · Wind {weather.data.current.windSpeedKph} km/h
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2 border-t border-outline-variant/40 pt-3">
                {weather.data.daily.slice(1).map((d) => (
                  <li key={d.date} className="text-xs text-on-surface-variant">
                    <span aria-hidden>{d.icon} </span>
                    {new Date(d.date).toLocaleDateString("en-PH", { weekday: "short" })}{" "}
                    {Math.round(d.minTempC)}°–{Math.round(d.maxTempC)}°C · {d.rainProbabilityPct}% rain
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>

        <Panel title="Recent Earthquakes">
          {quakes.status === "loading" && <Loading label="earthquake data" />}
          {quakes.status === "error" && <Failed />}
          {quakes.status === "ready" && quakes.data.earthquakes.length === 0 && (
            <p className="text-on-surface-variant">No recorded events nearby.</p>
          )}
          {quakes.status === "ready" && quakes.data.earthquakes.length > 0 && (
            <ul className="space-y-3">
              {quakes.data.earthquakes.slice(0, 4).map((q, i: number) => (
                <li key={i}>
                  <a href={q.details_link} target="_blank" rel="noreferrer" className="font-medium hover:text-primary">
                    M{q.magnitude?.toFixed(1)} · {q.location}
                  </a>
                  <p className="text-xs text-on-surface-variant">
                    {q.date_time} • {q.depth_km} km deep
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title={`DPWH Projects · ${dpwh.status === "ready" ? dpwh.data.scope : "Quezon"}`}>
          {dpwh.status === "loading" && <Loading label="DPWH projects" />}
          {dpwh.status === "error" && <Failed />}
          {dpwh.status === "ready" && (
            <div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <li><span className="font-semibold">{dpwh.data.summary.totalProjects.toLocaleString()}</span> total</li>
                <li><span className="font-semibold">{dpwh.data.summary.completed.toLocaleString()}</span> completed</li>
                <li><span className="font-semibold">{dpwh.data.summary.ongoing.toLocaleString()}</span> ongoing</li>
                <li><span className="font-semibold">{formatPeso(dpwh.data.summary.totalBudget)}</span> budget</li>
              </ul>
              <ul className="mt-3 space-y-2 border-t border-outline-variant/40 pt-3">
                {dpwh.data.projects.slice(0, 3).map((p) => (
                  <li key={p.contractId} className="text-xs leading-snug">
                    <span className="line-clamp-2">{p.description.toLowerCase()}</span>
                    <span className="block text-on-surface-variant">
                      {formatPeso(p.budget)} · {p.status} · {p.infraYear}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>
      </div>

      <p className="mt-4 text-xs text-on-surface-variant">
        Sources: Open-Meteo · Phivolcs · DPWH Infrastructure Transparency Portal.
        Cached server-side; not an official government channel.
      </p>
    </section>
  );
}
