"use client";

import dynamic from "next/dynamic";
import { site } from "@/lib/data/site";

const LucenaMap = dynamic(() => import("@/components/map/lucena-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100dvh-4rem)] items-center justify-center text-sm text-on-surface-variant">
      Loading map of {site.locality}…
    </div>
  ),
});

export default function MapClient({ className }: { className?: string }) {
  return (
    <div className={className ?? ""}>
      <LucenaMap />
    </div>
  );
}
