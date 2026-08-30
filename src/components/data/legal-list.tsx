"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/functions";
import type { DocumentsResponse, LegalType } from "@/types/legal";

type ApiError = { error: string };

const chipBase =
  "inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors";

function Loading() {
  return (
    <p role="status" className="animate-pulse text-sm text-on-surface-variant">
      Loading documents…
    </p>
  );
}

function Failed() {
  return <p className="text-sm text-red-600 dark:text-red-400">Unavailable right now. Please try again later.</p>;
}

export function LegalList({ activeType }: { activeType: string | null }) {
  const [data, setData] = useState<DocumentsResponse | null>(null);
  const [types, setTypes] = useState<LegalType[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams();
    if (activeType) params.set("type", activeType);

    axios
      .get<DocumentsResponse | ApiError>(`/api/legals?${params.toString()}`)
      .then((res) => {
        if (cancelled) return;
        if ("error" in res.data) {
          setFailed(true);
          return;
        }
        setData(res.data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    axios
      .get<LegalType[] | ApiError>("/api/legal/types")
      .then((res) => {
        if (cancelled) return;
        if (!("error" in res.data)) setTypes(res.data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [activeType]);

  if (failed) return <Failed />;

  if (!data) return <Loading />;

  const documents = data.documents;
  const totalByType = data.totalByType;
  const allCount = Object.values(totalByType).reduce((sum, n) => sum + n, 0);

  const labelOf = (id: string) => types.find((t) => t.id === id)?.label ?? id;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="navigation" aria-label="Filter by document type">
        <Link
          href="/legal"
          className={`${chipBase} ${!activeType
            ? "border-primary bg-primary text-on-primary font-medium"
            : "border-outline-variant text-on-surface-variant hover:bg-primary/8"
            }`}
        >
          All ({allCount})
        </Link>
        {types.map((t) => {
          const count = totalByType[t.id] ?? 0;
          const active = activeType === t.id;
          return (
            <Link
              key={t.id}
              href={`/legal?type=${t.id}`}
              className={`${chipBase} ${active
                ? "border-primary bg-primary text-on-primary font-medium"
                : "border-outline-variant text-on-surface-variant hover:bg-primary/8"
                } ${count === 0 ? "opacity-50" : ""}`}
            >
              {t.label} ({count})
            </Link>
          );
        })}
      </div>

      <ul className="mt-8 space-y-4">
        {documents.map((doc) => (
          <li key={doc.id}>
            <Card>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container">
                  {labelOf(doc.type)}
                </span>
                {doc.verification ? (
                  <span className="inline-flex items-center rounded-full bg-primary-container px-3 py-1 text-xs font-medium text-on-primary-container">
                    Verified
                  </span>
                ) : <span className="inline-flex items-center rounded-full border border-outline px-3 py-1 text-xs text-on-surface-variant">
                  Unverified
                </span>}
                <time dateTime={doc.date ?? undefined} className="text-xs text-on-surface-variant">
                  {formatDate(doc.date as string)}
                </time>
              </div>

              <h2 className="mt-3 text-lg font-semibold leading-snug">{doc.title}</h2>
              <p className="mt-0.5 text-sm font-medium text-primary">{doc.number}</p>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-on-surface-variant">
                {doc.summary}
              </p>

              {doc.sourceUrl && (
                <a
                  href={doc.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Read full text ({doc.sourceName}) →
                </a>
              )}
            </Card>
          </li>
        ))}
      </ul>

      {data.disclaimer && (
        <p className="mt-8 max-w-3xl rounded-card bg-surface-container p-4 text-xs leading-relaxed text-on-surface-variant shadow-elevation-1">
          {data.disclaimer}
        </p>
      )}
    </div>
  );
}
