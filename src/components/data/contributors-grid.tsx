"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import type { Contributor } from "@/types/contributors";

type ApiError = { error: string };

function Loading() {
  return (
    <p role="status" className="animate-pulse text-sm text-on-surface-variant">
      Loading contributors…
    </p>
  );
}

function Failed() {
  return <p className="text-sm text-red-600 dark:text-red-400">Unavailable right now. Please try again later.</p>;
}

export function ContributorsGrid({ limit = 8 }: { limit?: number }) {
  const [contributors, setContributors] = useState<Contributor[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    axios
      .get<Contributor[] | ApiError>("/api/contribute/members")
      .then((res) => {
        if ("error" in res.data || !Array.isArray(res.data)) {
          setFailed(true);
          return;
        }
        setContributors(res.data);
      })
      .catch(() => setFailed(true));
  }, []);

  if (failed) return <Failed />;

  if (!contributors) return <Loading />;

  if (contributors.length === 0) return <p className="text-sm text-on-surface-variant">No contributors yet.</p>;

  return (
    <div className="flex flex-wrap gap-4">
      {contributors.slice(0, limit).map((contrib, i: number) => (
        <Card
          key={`${i}. ${contrib.username}`}
          className="flex flex-col w-[calc(25%-1rem)] gap-2"
        >
          {contrib.avatar_url ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                className="object-cover"
                src={contrib.avatar_url}
                alt="User Profile"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center aspect-square w-full">User Profile</div>
          )}
          <p className="mt-4 text-xs uppercase tracking-wider text-secondary">{contrib.user_type}</p>
          <p className="text-base font-semibold">{contrib.username}</p>
        </Card>
      ))}
    </div>
  );
}
