import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import ProjectMapClient from "@/components/map/project-map-client";
import type { MappedProject } from "@/components/map/project-map";
import { getDpwhProjects } from "@/lib/sources/dpwh";
import type { DpwhProject } from "@/types/live-data";

export const metadata: Metadata = {
  title: "National Projects",
  description:
    "Map of national government infrastructure projects in Lucena City and their implementation status.",
};

export const revalidate = 900;

const STATUSES = ["Completed", "On-Going", "Not Started"] as const;

type SourceProject = DpwhProject & { isLocal?: boolean };

function isMappable(project: SourceProject): project is MappedProject {
  return project.isLocal === true && project.latitude != null && project.longitude != null;
}

export default async function NationalProjectsPage() {
  const batches = await Promise.allSettled(
    STATUSES.map((status) =>
      getDpwhProjects({
        search: "Lucena",
        status,
        limit: 50,
        scopeAll: true,
      })
    )
  );

  const unique = new Map<string, MappedProject>();
  for (const batch of batches) {
    if (batch.status !== "fulfilled") continue;
    for (const project of batch.value.projects) {
      if (isMappable(project) && !unique.has(project.contractId)) {
        unique.set(project.contractId, project);
      }
    }
  }

  const projects = [...unique.values()];
  const summary = STATUSES.map((status) => ({
    status,
    count: projects.filter((project) => project.status === status).length,
  }));

  return (
    <div>
      <PageHeader
        eyebrow="Mga Pambansang Proyekto · Transparency"
        title="National Projects"
        description="See where national government infrastructure projects stand in Lucena City. Each marker shows a project's status, budget, and progress."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="project-map-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="project-map-heading" className="text-2xl font-semibold tracking-tight">
              Project locations
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Click a marker for details. Colors follow the status legend on the map.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-on-surface-variant">
            <li>
              <span className="font-semibold text-on-surface">{projects.length}</span> mapped
            </li>
            {summary.map((item) => (
              <li key={item.status}>
                <span className="font-semibold text-on-surface">{item.count}</span> {item.status.toLowerCase()}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <ProjectMapClient projects={projects} />
        </div>

        <p className="mt-4 text-xs text-on-surface-variant">
          Source: DPWH Infrastructure Transparency Portal. Cached for 15 minutes; not an official
          government channel. Projects without published coordinates are not shown.
        </p>
      </section>
    </div>
  );
}
