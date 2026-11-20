"use client";

import dynamic from "next/dynamic";
import type { MappedProject } from "@/components/map/project-map";

const ProjectMap = dynamic(() => import("@/components/map/project-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] min-h-[26rem] items-center justify-center rounded-card border border-outline-variant/40 bg-surface-container-low text-sm text-on-surface-variant">
      Loading project map…
    </div>
  ),
});

export default function ProjectMapClient({ projects }: { projects: MappedProject[] }) {
  return <ProjectMap projects={projects} />;
}
