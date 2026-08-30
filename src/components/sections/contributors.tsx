import { ContributorsGrid } from "@/components/data/contributors-grid";
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
      <ContributorsGrid limit={8} />
    </section>
  );
}
