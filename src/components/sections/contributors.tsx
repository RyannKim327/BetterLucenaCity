import { Card } from "@/components/ui/card";
import { internalApiUrl } from "@/lib/sources/shared";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";


interface ContributorsInterface {
  username: string
  avatar_url: string
  user_type: string
}

async function fetchUser() {
  try {
    const { data } = await axios.get<ContributorsInterface[]>(internalApiUrl("/api/contribute/members"), {
      headers: { Accept: "application/json" },
    });
    return data
  } catch (e) {
    console.error(e)
    return []
  }
}

export default async function Contributors() {
  const [contributors] = await Promise.all([fetchUser()])
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
              {contrib.avatar_url ?
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image className="object-cover" src={contrib.avatar_url} alt="User Profile" fill sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
                :
                <div className="flex items-center justify-center aspect-square w-full">User Profile</div>
              }
              <p className=" mt-4 text-xs uppercase tracking-wider text-secondary">{contrib.user_type}</p>
              <p className="text-base font-semibold">{contrib.username}</p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
