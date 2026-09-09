import { PageHeader } from "@/components/layout/page-header";
import { ContributorsPageClient } from "@/components/contributors/contributors-page-client";
import { LucenaHistory } from "@/lib/data/history";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Contributors() {
  return (
    <div>
      <PageHeader
        eyebrow="Nakaraan at kaysaysayan"
        title="History"
        description="What is Lucena before it become Lucena City."
      />
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-2">
        {LucenaHistory.timeline.map((lc, i: number) => {
          return (
            <Card key={`${i}. ${lc.date}`}>
              <p className="text-xs uppercase tracking-wider text-secondary">{lc.date}</p>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{lc.content}</p>
            </Card>
          )
        })}
      </section>
      <div className="flex flex-wrap justify-center gap-2">
        {LucenaHistory.sources.map((sc, i: number) => {
          return (
            <Link key={`${i}. ${sc.url}`} href={sc.url} className="shrink-0 text-sm font-medium hover:text-primary hover:underline">
              {sc.title}
            </Link>
          )
        })}
      </div>
    </div>
  );
}
