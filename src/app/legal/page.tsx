import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/functions";
import { internalApiUrl } from "@/lib/sources/shared";
import axios from "axios";
import type { LegalDocument } from "@/types/sources";

export const metadata: Metadata = {
  title: "Laws & Ordinances",
};

const chipBase =
  "inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors";

interface LegalType {
  id: string;
  label: string;
}

interface DocumentsResponse {
  locality: string;
  disclaimer: string;
  total: number;
  totalByType: Record<string, number>;
  types: LegalType[];
  documents: LegalDocument[];
}

async function getTypes(): Promise<LegalType[]> {
  try {
    const { data } = await axios.get<LegalType[]>(internalApiUrl("/api/legal/types"), {
      headers: { Accept: "application/json" },
    });
    return data;
  } catch {
    return [];
  }
}

async function getDocuments(type?: string): Promise<DocumentsResponse> {
  try {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    const { data } = await axios.get<DocumentsResponse>(
      internalApiUrl(`/api/legals?${params.toString()}`),
      { headers: { Accept: "application/json" } }
    );
    return data;
  } catch {
    return { locality: "", disclaimer: "", total: 0, totalByType: {}, types: [], documents: [] };
  }
}

export default async function LegalPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const activeType = type ?? null;

  const [documentsData, types] = await Promise.all([
    getDocuments(activeType ?? undefined),
    getTypes(),
  ]);

  const documents = documentsData.documents;
  const totalByType = documentsData.totalByType;
  const allCount = Object.values(totalByType).reduce((sum, n) => sum + n, 0);

  const labelOf = (id: string) =>
    types.find((t) => t.id === id)?.label ?? id;

  return (
    <div>
      <PageHeader
        eyebrow="Batas at mga Ordinansa"
        title="Laws & City Ordinances"
        description="The legal foundations of Lucena City — from its 1961 charter to city-level ordinances, resolutions, executive orders, and memoranda."
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
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

        {documentsData.disclaimer && (
          <p className="mt-8 max-w-3xl rounded-card bg-surface-container p-4 text-xs leading-relaxed text-on-surface-variant shadow-elevation-1">
            {documentsData.disclaimer}
          </p>
        )}
      </section>
    </div >
  );
}
