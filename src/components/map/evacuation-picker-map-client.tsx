"use client";

import dynamic from "next/dynamic";
import type { EvacuationCenter } from "@/types/emergency";
import type { PickedPoint } from "@/components/map/evacuation-picker-map";

const EvacuationPickerMap = dynamic(() => import("@/components/map/evacuation-picker-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] min-h-[26rem] items-center justify-center rounded-card border border-outline-variant/40 bg-surface-container-low text-sm text-on-surface-variant">
      Loading locator map…
    </div>
  ),
});

export default function EvacuationPickerMapClient({
  point,
  onPick,
  centers,
}: {
  point: PickedPoint | null;
  onPick: (point: PickedPoint) => void;
  centers: EvacuationCenter[];
}) {
  return <EvacuationPickerMap point={point} onPick={onPick} centers={centers} />;
}
