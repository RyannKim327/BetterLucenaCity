import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { formatDate } from "@/lib/functions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supa = await createClient();
  const { data } = await supa
    .from("announcements")
    .select("title")
    .eq("id", Number(id))
    .maybeSingle();
  const title = (data as { title?: string } | null)?.title ?? "Announcement";
  return { title: `${title} — Announcements` };
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (Number.isNaN(numericId)) notFound();

  const supa = await createClient();
  const { data, error } = await supa
    .from("announcements")
    .select("id, title, content, date_added, data_source, approved_by")
    .eq("id", numericId)
    .maybeSingle();

  if (error || !data) notFound();

  const row = data as {
    id: number;
    title: string;
    content: string;
    date_added: string;
    data_source: string[] | null;
    approved_by: string | null;
  };

  // Only approved announcements are public; draft/unapproved still returns 404 for anon
  // If approved_by is null, hide from public (unless you want pending visible)
  if (!row.approved_by) notFound();

  return (
    <div>
      <div className="border-b border-outline-variant/40 bg-surface-container-low">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <Link href="/announcements" className="inline-flex text-sm font-medium text-primary hover:underline">
            ← Back to announcements
          </Link>
          <p className="mt-6 text-sm font-medium uppercase tracking-widest text-secondary">Abiso</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight leading-tight">{row.title}</h1>
          <time dateTime={row.date_added} className="mt-3 block text-sm text-on-surface-variant">
            {formatDate(row.date_added)}
          </time>
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Card>
          <Markdown content={row.content} />
          {Array.isArray(row.data_source) && row.data_source.length > 0 && (
            <div className="mt-6 rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">References</p>
              <ul className="mt-2 space-y-1">
                {row.data_source.map((u, i) => (
                  <li key={`${u}-${i}`} className="truncate">
                    <a href={u} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline">
                      {u}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <div className="mt-6 flex gap-3">
          <Link
            href="/announcements"
            className="inline-flex h-10 items-center justify-center rounded-full border border-outline-variant px-6 text-sm font-medium text-primary hover:bg-primary/8"
          >
            View all announcements
          </Link>
        </div>
      </section>
    </div>
  );
}
