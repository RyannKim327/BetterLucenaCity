"use client";

import { useEffect } from "react";
import { CircleMarker, GeoJSON, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngBoundsExpression } from "leaflet";
import { BoundaryData } from "@/types/map";

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

export interface BarangayBoundary {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}

export interface BarangayInfo {
  name: string;
  displayName: string;
  osmRelationId: number;
  osmPlaceId: number;
  latitude: number;
  longitude: number;
  center: { latitude: number; longitude: number };
  bounds: { south: number; north: number; west: number; east: number };
  boundary: BarangayBoundary;
  border: BarangayBoundary;
}

export default function BarangayMap({ data: props }: { data: BarangayInfo }) {
  return (
    <div className="relative aspect-video w-full z-1">
      <MapContainer
        center={[props.latitude, props.longitude]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
        attributionControl={true}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {props.boundary && (
          <>
            <GeoJSON
              key={props.name}
              data={props.boundary as never}
              style={{
                color: "#00695c",
                weight: 2.5,
                opacity: 0.9,
                fillColor: "#9ef2e0",
                fillOpacity: 0.12,
              }}
            />
            <FitBounds data={props} />
          </>
        )}

        {props.boundary && (
          <CircleMarker
            center={[props.center.latitude, props.center.longitude]}
            radius={8}
            pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#00695c", fillOpacity: 1 }}
          >
            <Popup>Lucena City proper</Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
