import { Card } from "@/components/ui/card";
import { contributors } from "@/lib/data/contributors";
import Image from "next/image";
import Link from "next/link";

export default function Contributors() {
  return (
    <section className="flex flex-col mx-auto max-w-6xl gap-4 px-4 py-16 sm:px-6" aria-labelledby="about-heading">
      <div className="flex items-center justify-between gap-4">
        <h2 id="about-heading" className="text-2xl font-semibold tracking-tight">Contributors</h2>
        <Link href="/contributors" className="shrink-0 text-sm font-medium text-primary hover:underline">
          View all →
        </Link>
      </div>
      <div className="flex flex-wrap gap-4">
        {contributors.slice(0, 8).map((contrib, i: number) => {
          return (
            <Card
              key={`${i}. ${contrib.username}`}
              className="flex flex-col w-[calc(25%-1rem)] gap-2">
              {contrib.img ?
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image className="object-cover" src={contrib.img} alt="User Profile" fill sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
                :
                <div className="flex items-center justify-center aspect-square w-full">User Profile</div>
              }
              <p className=" mt-4 text-xs uppercase tracking-wider text-secondary">{contrib.position}</p>
              <p className="text-base font-semibold">{contrib.username}</p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
