import { Card } from "@/components/ui/card";
import { LucenaHistory } from "@/lib/data/history";
import Link from "next/link";

export default function History() {
  const timeline = LucenaHistory.timeline
  return (
    <section className="flex flex-col mx-auto max-w-6xl gap-4 px-4 py-16 sm:px-6" aria-labelledby="history-heading">
      <div className="flex items-center justify-between gap-4">
        <h2 id="history-heading" className="text-2xl font-semibold tracking-tight">Lucena's Timeline and Brief History</h2>
        <Link href="/history" className="shrink-0 text-sm font-medium text-primary hover:underline">
          View all →
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {timeline.slice((timeline.length - 5)).map((lc, i: number) => {
          return (
            <Card key={`${i}. ${lc.date}`}>
              <p className="text-xs uppercase tracking-wider text-secondary">{lc.date}</p>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{lc.content}</p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
