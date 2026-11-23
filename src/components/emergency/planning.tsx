import Link from "next/link";
import { Card } from "@/components/ui/card";
import EvacuationMapClient from "@/components/map/evacuation-map-client";
import { disasterTips } from "@/lib/data/disaster-tips";
import type { EvacuationCenter } from "@/types/emergency";

export default function DisasterPlanning({ centers }: { centers: EvacuationCenter[] }) {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6">
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Handa sa anumang mangyari</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
              Mga simpleng hakbang para sa lindol, baha, bagyo, at sunog. Ang kaalaman ngayon ay
              kaligtasan bukas—share it sa pamilya at ka-barangay.
            </p>
          </div>
          <Link href="/emergency/hotlines" className="text-sm font-medium text-primary hover:underline">
            Emergency hotlines →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {disasterTips.map((tip) => (
            <Card key={tip.id}>
              <h3 id={tip.id} className="text-base font-semibold">{tip.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{tip.description}</p>
              <ul className="mt-4 space-y-2">
                {tip.tips.map((tipText) => (
                  <li key={tipText} className="flex gap-2 text-sm leading-relaxed text-on-surface-variant">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                    <span>{tipText}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight">Evacuation centers</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Mga kilalang evacuation center sa Lucena City. Sundin ang pinakamalapit at pinaka-safe para
          sa inyo, at laging unahin ang official advisory.
        </p>

        <div className="mt-6">
          <EvacuationMapClient centers={centers} />
        </div>

        <h3 className="mt-8 text-lg font-semibold tracking-tight">Listahan ng centers</h3>
        <Card className="mt-4 overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface-container text-xs uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Location (Barangay)</th>
                <th scope="col" className="px-4 py-3 font-medium">Latitude</th>
                <th scope="col" className="px-4 py-3 font-medium">Longitude</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {centers.map((center) => (
                <tr key={center.id ?? `${center.name}-${center.barangay}`}>
                  <td className="px-4 py-3 font-medium">{center.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{center.barangay}</td>
                  <td className="px-4 py-3 tabular-nums text-on-surface-variant">{center.latitude.toFixed(6)}</td>
                  <td className="px-4 py-3 tabular-nums text-on-surface-variant">{center.longitude.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
          Hindi kumpleto ang listahan at ang mga coordinates ay reference points, hindi laging eksaktong
          pinagpasukan. I-verify ang tamang center at meeting point sa barangay nyo o sa Lucena LDRRMO
          (0970 128 5078) bago mag-evacuate.
        </p>
      </section>
    </div>
  );
}
