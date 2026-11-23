"use client";

import dynamic from "next/dynamic";
import type { EvacuationCenter } from "@/types/emergency";

const EvacuationMap = dynamic(() => import("@/components/map/evacuation-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] min-h-[26rem] items-center justify-center rounded-card border border-outline-variant/40 bg-surface-container-low text-sm text-on-surface-variant">
      Loading evacuation map…
    </div>
  ),
});

export default function EvacuationMapClient({ centers }: { centers: EvacuationCenter[] }) {
  return <EvacuationMap centers={centers} />;
}
