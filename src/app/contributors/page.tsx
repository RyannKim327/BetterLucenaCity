import { PageHeader } from "@/components/layout/page-header"
import { Card } from "@/components/ui/card"
import { contributors } from "@/lib/data/contributors"

export default function Contributors() {
  return (
    <div>
      <PageHeader
        eyebrow="Mga nagbigay ambag"
        title="Contributors"
        description="People behind this project."
      />
      <section className="flex flex-wrap gap-4 mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {contributors.slice(0, 8).map((contrib, i: number) => {
          return (
            <Card
              key={`${i}. ${contrib.username}`}
              className="flex flex-col w-[calc(25%-1rem)] gap-2">
              <img className="rounded-lg" src={contrib.img ?? ""} alt="" />
              <p className="mt-4 text-xs uppercase tracking-wider text-secondary">{contrib.position}</p>
              <p className="text-base font-semibold">{contrib.username}</p>
            </Card>
          )
        })}
      </section>
    </div>
  )
}
