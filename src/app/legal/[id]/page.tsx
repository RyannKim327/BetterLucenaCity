import NotFound from "@/app/not-found";
import { Card } from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

function parseDate(date: string) {
  const d = new Date(date)
  const month = d.getMonth() + 1
  return `${month}/${d.getDate()}/${d.getFullYear()}`
}

export default async function LegalView({ params }: Props) {
  const { id } = await params
  const supabase = await createClient();

  const { data: legal, error } = await supabase
    .from("legals")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Card>
          <p className="text-sm text-secondary">Failed to load report: {error.message}</p>
        </Card>
      </div>
    );
  }
  if (!legal) NotFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/legal" className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary">
        &larr; Back to legals
      </Link>

      <Card className="mt-4">
        <div className="flex flex-col items-center gap-2">
          <span className="font-bold font-serif text-xl w-full text-center">
            {legal.title}
          </span>
          <span className="text-xs w-full text-center">
            {parseDate(legal.proclamation_date)}
          </span>
          {
            legal.content &&
            <Markdown content={legal.content} />
          }
          {
            legal.source_url &&
            <a
              href={legal.source_url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Read full text ({legal.source_name}) →
            </a>
          }
        </div>
      </Card>
    </div>
  )
}
