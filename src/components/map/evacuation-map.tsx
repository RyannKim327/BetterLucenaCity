"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { EvacuationCenter } from "@/types/emergency";

function FitCenters({ centers }: { centers: EvacuationCenter[] }) {
  const map = useMap();

  useEffect(() => {
    if (centers.length === 0) return;
    const bounds: LatLngBoundsExpression = centers.map((center) => [
      center.latitude,
      center.longitude,
    ]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [map, centers]);

  return null;
}

export default function EvacuationMap({ centers }: { centers: EvacuationCenter[] }) {
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

        {centers.map((center) => (
          <CircleMarker
            key={center.id ?? `${center.name}-${center.barangay}`}
            center={[center.latitude, center.longitude]}
            radius={9}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: "#0f766e",
              fillOpacity: 1,
            }}
          >
            <Popup>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-snug">{center.name}</p>
                <p className="text-xs text-on-surface-variant">{center.barangay}</p>
                <p className="text-xs text-on-surface-variant">
                  {center.latitude.toFixed(6)}, {center.longitude.toFixed(6)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        <FitCenters centers={centers} />
      </MapContainer>

      <div className="pointer-events-none absolute bottom-4 left-4 z-[1000] rounded-card border border-outline-variant/40 bg-surface-container/95 px-3 py-2 text-xs font-medium shadow-elevation-2 backdrop-blur">
        {centers.length} evacuation {centers.length === 1 ? "center" : "centers"}
      </div>

      {centers.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-[1000] mx-auto w-fit rounded-full bg-surface-container px-4 py-2 text-sm text-on-surface-variant shadow-elevation-1">
          No evacuation centers available right now.
        </div>
      )}
    </div>
  );
}
