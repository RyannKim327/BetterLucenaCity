"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CircleMarker, GeoJSON, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngBoundsExpression } from "leaflet";

interface BoundaryData {
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

function FitBounds({ data }: { data: BoundaryData }) {
  const map = useMap();
  useEffect(() => {
    const bounds: LatLngBoundsExpression = [
      [data.bounds.south, data.bounds.west],
      [data.bounds.north, data.bounds.east],
    ];
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, data]);
  return null;
}

export default function LucenaMap() {
  const [boundary, setBoundary] = useState<BoundaryData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    axios
      .get<BoundaryData>("/api/geography/boundary")
      .then((res) => {
        if (!cancelled) setBoundary(res.data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative h-full w-full z-1">
      <MapContainer
        center={[13.9333, 121.6167]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
        attributionControl={true}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {boundary && (
          <>
            <GeoJSON
              key={boundary.displayName}
              data={boundary.boundary as never}
              style={{
                color: "#00695c",
                weight: 2.5,
                opacity: 0.9,
                fillColor: "#9ef2e0",
                fillOpacity: 0.12,
              }}
            />
            <FitBounds data={boundary} />
          </>
        )}

        {boundary && (
          <CircleMarker
            center={[boundary.center.latitude, boundary.center.longitude]}
            radius={8}
            pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#00695c", fillOpacity: 1 }}
          >
            <Popup>Lucena City proper</Popup>
          </CircleMarker>
        )}
      </MapContainer>

      {!boundary && !failed && (
        <div className="absolute inset-x-0 top-4 mx-auto w-fit rounded-full bg-surface-container px-4 py-2 text-sm text-on-surface-variant shadow-elevation-1">
          Loading city boundary…
        </div>
      )}
      {failed && (
        <div className="absolute inset-x-0 top-4 mx-auto w-fit rounded-full bg-surface-container px-4 py-2 text-sm text-red-600 shadow-elevation-1">
          Boundary unavailable right now.
        </div>
      )}
    </div>
  );
}
