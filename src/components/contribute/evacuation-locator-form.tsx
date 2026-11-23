"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DataSourceInput } from "@/components/ui/data-source-input";
import EvacuationPickerMapClient from "@/components/map/evacuation-picker-map-client";
import type { PickedPoint } from "@/components/map/evacuation-picker-map";
import type { EvacuationCenter } from "@/types/emergency";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "text-sm font-medium text-on-surface";
const hintClass = "text-xs leading-relaxed text-on-surface-variant";

export function EvacuationLocatorForm({
  userEmail,
  centers,
}: {
  userEmail: string;
  centers: EvacuationCenter[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [point, setPoint] = useState<PickedPoint | null>(null);
  const [dataSource, setDataSource] = useState<string[]>([]);

  const barangayOptions = Array.from(new Set(centers.map((center) => center.barangay))).sort();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const barangay = String(data.get("barangay") ?? "").trim();

    setErrorMsg("");
    if (!name || !barangay || !point) {
      setStatus("error");
      setErrorMsg("Kailangan ang pangalan, barangay, at pin sa mapa bago magsumite.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/evacuation-centers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          barangay,
          latitude: point.latitude,
          longitude: point.longitude,
          data_source: dataSource,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Failed to submit evacuation center.");

      form.reset();
      setPoint(null);
      setDataSource([]);
      setStatus("success");
      router.push(body.discussionId ? `/discussion/${body.discussionId}` : "/discussion");
    } catch (error) {
      setStatus("error");
      setErrorMsg(error instanceof Error ? error.message : "Failed to submit evacuation center.");
    }
  }

  if (status === "success") {
    return (
      <Card className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm font-medium">Uploading… Redirecting to discussion</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Evacuation locator</h2>
        <p className={`mt-1 ${hintClass}`}>
          Ilagay ang pangalan at barangay ng evacuation center, i-click ang mapa para makuha ang
          eksaktong latitude at longitude, then isumite para sa validation.
        </p>
        <p className={`mt-1 ${hintClass}`}>Submitting as {userEmail || "signed-in contributor"}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Pangalan ng evacuation center <span className="text-secondary">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={160}
              placeholder="Hal. Lucena City Evacuation Center"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="barangay" className={labelClass}>
              Location (Barangay) <span className="text-secondary">*</span>
            </label>
            <input
              id="barangay"
              name="barangay"
              type="text"
              list="barangay-options"
              required
              maxLength={120}
              placeholder="Hal. Brgy. 10"
              className={fieldClass}
            />
            <datalist id="barangay-options">
              {barangayOptions.map((barangay) => (
                <option key={barangay} value={barangay} />
              ))}
            </datalist>
          </div>
        </div>

        <div>
          <p className={labelClass}>Piliin ang lokasyon sa mapa <span className="text-secondary">*</span></p>
          <p className={hintClass}>
            I-click ang eksaktong pinaglagyan ng evacuation center. Ang mga abuhang pin ay mga
            naunang naisumiteng center.
          </p>
          <div className="mt-3">
            <EvacuationPickerMapClient point={point} onPick={setPoint} centers={centers} />
          </div>

          <input type="hidden" name="latitude" value={point?.latitude ?? ""} />
          <input type="hidden" name="longitude" value={point?.longitude ?? ""} />

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="latitude" className={labelClass}>Latitude</label>
              <input
                id="latitude"
                type="text"
                readOnly
                value={point ? point.latitude.toFixed(6) : ""}
                placeholder="I-click ang mapa"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="longitude" className={labelClass}>Longitude</label>
              <input
                id="longitude"
                type="text"
                readOnly
                value={point ? point.longitude.toFixed(6) : ""}
                placeholder="I-click ang mapa"
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        <DataSourceInput
          value={dataSource}
          onChange={setDataSource}
          label="Reference links (optional)"
          hint="Magdagdag ng link mula sa barangay, LDRRMO, o ibang mapagkukunan para ma-verify ng validator."
        />

        <label className="flex items-start gap-2 text-xs leading-relaxed text-on-surface-variant">
          <input type="checkbox" name="consent" required className="mt-0.5" />
          <span>Pinatutunayan kong tama ang impormasyon at may pahintulot akong isumite ito para sa pampublikong pagsusuri.</span>
        </label>

        {status === "error" && (
          <p className="rounded-xl bg-secondary-container/40 px-4 py-3 text-sm text-on-secondary-container">
            {errorMsg}
          </p>
        )}
        {status === "submitting" && (
          <p className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Loader2 className="h-4 w-4 animate-spin" /> Gumagawa ng record at discussion thread…
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-on-primary shadow-elevation-1 hover:bg-primary/90 disabled:opacity-70"
        >
          {status === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          Sumite ng evacuation center
        </button>
      </form>
    </Card>
  );
}
