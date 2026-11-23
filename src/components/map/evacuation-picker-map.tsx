"use client";

import { CircleMarker, MapContainer, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { EvacuationCenter } from "@/types/emergency";

export type PickedPoint = {
  latitude: number;
  longitude: number;
};

function MapClickHandler({ onPick }: { onPick: (point: PickedPoint) => void }) {
  useMapEvents({
    click(event) {
      onPick({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    },
  });
  return null;
}

export default function EvacuationPickerMap({
  point,
  onPick,
  centers,
}: {
  point: PickedPoint | null;
  onPick: (point: PickedPoint) => void;
  centers: EvacuationCenter[];
}) {
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
        <MapClickHandler onPick={onPick} />

        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {centers.map((center) => (
          <CircleMarker
            key={center.id ?? `${center.name}-${center.barangay}`}
            center={[center.latitude, center.longitude]}
            radius={6}
            pathOptions={{
              color: "#ffffff",
              weight: 1,
              fillColor: "#94a3b8",
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <p className="text-xs font-medium">{center.name}</p>
              <p className="text-xs text-on-surface-variant">{center.barangay} · naunang naisumite</p>
            </Popup>
          </CircleMarker>
        ))}

        {point && (
          <CircleMarker
            center={[point.latitude, point.longitude]}
            radius={10}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: "#0f766e",
              fillOpacity: 1,
            }}
          >
            <Popup>
              <p className="text-xs font-medium">Napiling lokasyon</p>
              <p className="text-xs text-on-surface-variant">
                {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
              </p>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>

      <div className="pointer-events-none absolute inset-x-0 top-4 z-[1000] mx-auto w-fit rounded-full bg-surface-container/95 px-4 py-2 text-xs font-medium text-on-surface shadow-elevation-2 backdrop-blur">
        I-click ang mapa para ilagay ang pin · lumalabas ang latitude &amp; longitude sa ibaba
      </div>
    </div>
  );
}
