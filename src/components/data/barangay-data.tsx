"use client"

import dynamic from "next/dynamic";
import { barangays } from "@/lib/sources/barangays";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BarangayMap = dynamic(() => import("@/components/map/barangay-map"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-surface-container text-sm text-on-surface-variant">
      Loading barangay map…
    </div>
  ),
});

const barangayInfo = barangays;

interface BrgyInfo {
  name: string;
  population: number;
  year: number;
}

async function searchBarangayInfo(brgy: string): Promise<BrgyInfo[] | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("barangay_information")
    .select("name, population, year")
    .eq("name", brgy)
    .order("year", { ascending: false })
    .limit(3)

  if (error) {
    console.error("Failed to fetch barangay info:", error);
    return null;
  }
  return data;
}

export default function BarangayData() {
  const [brgy, setBrgy] = useState(0);
  const [info, setInfo] = useState<BrgyInfo[] | null>(null);
  const [loading, setLoading] = useState(false);

  const selected = barangayInfo[brgy];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setInfo(null);
    searchBarangayInfo(selected.name).then((data) => {
      if (!cancelled) {
        setInfo(data as BrgyInfo[]);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selected.name]);

  return (
    <div className="flex flex-col md:flex-row w-full gap-4">
      <div className="flex flex-col gap-3 max-h-[70dvh] md:max-h-dvh overflow-y-auto w-full md:w-[calc(50%-0.5rem)] pr-1">
        {barangayInfo.map((b, i: number) => {
          const isActive = i === brgy;
          return (
            <Card
              key={b.name}
              className={`flex items-center justify-between ${isActive ? "border-primary bg-surface-container-high" : ""}`}
            >
              <p className={`font-medium ${isActive ? "text-primary" : ""}`}>{b.name}</p>
              <button
                onClick={() => setBrgy(i)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${isActive ? "bg-primary text-on-primary" : "bg-surface-container-highest hover:bg-surface-container-high cursor-pointer"}`}
                aria-pressed={isActive}
              >
                {isActive ? "Selected" : "View"}
              </button>
            </Card>
          );
        })}
      </div>
      <Card className="w-full md:w-[calc(50%-0.5rem)] max-h-[70dvh] md:h-dvh md:sticky md:top-4 h-fit overflow-hidden overflow-y-auto">
        <BarangayMap key={selected.name} data={selected} />
        <div className="pt-4 space-y-3">
          <h3 className="text-lg font-semibold">{selected.name}</h3>
          <p className="text-sm text-on-surface-variant">{selected.displayName}</p>

          <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
            <div className="rounded-xl bg-surface-container p-3">
              <p className="text-xs text-on-surface-variant uppercase tracking-wide">Center</p>
              <p className="font-mono">{selected.center.latitude.toFixed(4)}, {selected.center.longitude.toFixed(4)}</p>
            </div>
            <div className="rounded-xl bg-surface-container p-3">
              <p className="text-xs text-on-surface-variant uppercase tracking-wide">Bounds</p>
              <p className="font-mono text-xs">
                {selected.bounds.south.toFixed(3)}–{selected.bounds.north.toFixed(3)}, {selected.bounds.west.toFixed(3)}–{selected.bounds.east.toFixed(3)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant/30 p-4">
            <p className="text-xs text-on-surface-variant uppercase tracking-wide mb-1">Barangay info</p>
            {loading ? (
              <p className="text-sm text-on-surface-variant">Loading population…</p>
            ) : info ? info.map((d, i: number) => {
              return (
                <div key={`${i}. ${d.name}`} className="space-y-1 text-sm grid grid-cols-2">
                  <p>
                    <span className="text-on-surface-variant">Population:</span> {d.population}
                  </p>
                  <p>
                    <span className="text-on-surface-variant">Year:</span> {d.year}
                  </p>
                </div>
              )
            }) : (
              <p className="text-sm text-on-surface-variant">No population record yet for {selected.name}.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
