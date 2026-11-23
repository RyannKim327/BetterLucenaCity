"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPeso } from "@/lib/functions";
import type { DpwhProject } from "@/types/live-data";

export type MappedProject = Omit<DpwhProject, "latitude" | "longitude"> & {
  latitude: number;
  longitude: number;
};

export const STATUS_LEGEND = [
  { status: "Completed", label: "Done", color: "#2e7d32" },
  { status: "On-Going", label: "On Going", color: "#f59e0b" },
  { status: "Not-Started", label: "Not started", color: "#dc2626" },
] as const;

function statusMeta(status: string) {
  return STATUS_LEGEND.find((item) => item.status === status) ?? {
    label: status,
    color: "#6b7280",
  };
}

function FitProjects({ projects }: { projects: MappedProject[] }) {
  const map = useMap();

  useEffect(() => {
    const bounds: LatLngBoundsExpression = projects.map((project) => [
      project.latitude,
      project.longitude,
    ]);
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [map, projects]);

  return null;
}

export default function ProjectMap({ projects }: { projects: MappedProject[] }) {
  return (
    <div className="relative z-10 h-[60vh] min-h-[26rem] w-full overflow-hidden rounded-card border border-outline-variant/40 shadow-elevation-1">
      <MapContainer
        center={[13.9333, 121.6167]}
        zoom={12}
        minZoom={5}
        maxZoom={19}
        scrollWheelZoom={false}
        className="h-full w-full"
        attributionControl={true}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {projects.map((project) => {
          const meta = statusMeta(project.status);
          return (
            <CircleMarker
              key={project.contractId}
              center={[project.latitude, project.longitude]}
              radius={8}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: meta.color,
                fillOpacity: 1,
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                    {project.contractId} · {project.infraYear}
                  </p>
                  <p className="text-sm font-medium leading-snug">{project.description}</p>
                  <p className="text-xs text-on-surface-variant">
                    {project.location.province} · {project.category}
                  </p>
                  <p className="flex flex-wrap gap-x-3 pt-1 text-xs">
                    <span className="font-semibold" style={{ color: meta.color }}>
                      {meta.label}
                    </span>
                    <span>{formatPeso(project.budget)}</span>
                    <span>{project.progress}% complete</span>
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        <FitProjects projects={projects} />
      </MapContainer>

      <div className="pointer-events-none absolute bottom-4 left-4 z-[1000] rounded-card border border-outline-variant/40 bg-surface-container/95 p-3 shadow-elevation-2 backdrop-blur">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Status
        </p>
        <ul className="space-y-1.5">
          {STATUS_LEGEND.map((item) => (
            <li key={item.status} className="flex items-center gap-2 text-xs">
              <span
                aria-hidden
                className="inline-block h-3 w-3 rounded-full ring-2 ring-white/80"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
              <span className="ml-auto pl-3 text-on-surface-variant">
                {projects.filter((project) => project.status === item.status).length}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {projects.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-[1000] mx-auto w-fit rounded-full bg-surface-container px-4 py-2 text-sm text-on-surface-variant shadow-elevation-1">
          No geotagged projects available right now.
        </div>
      )}
    </div>
  );
}
