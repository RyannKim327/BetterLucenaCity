import { Card } from "@/components/ui/card";
import { contributors } from "@/lib/data/contributors";

export default function Contributors() {
  return (
    <section className="flex flex-col mx-auto max-w-6xl gap-4 px-4 py-16 sm:px-6" aria-labelledby="about-heading">
      <div className="flex items-center justify-between gap-4">
        <h2 id="about-heading" className="text-2xl font-semibold tracking-tight">Contributors</h2>
      </div>
      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        {contributors.map((contrib, i: number) => {
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
      </div>
    </section>
  )
}
