import { PageHeader } from "@/components/layout/page-header";
import { CollapsableCard } from "@/components/ui/collapsable-card";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "About Us",
  description: "About BetterLucenaCity. Some shared basic information about us.",
  keywords: [
    "About Better Lucena City",
    "Better Lucena City About Us",
    "Lucenahin"
  ]
}

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Tungkol sa amin"
        title="About Us"
        description="About BetterLucnaCity. Some shared basic information about us."
      />
      <section className="flex flex-col gap-2 mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <CollapsableCard summary="Better Lucena City">
          <blockquote>
            &emsp;is a community-maintained directory of Better LGU digital transparency portals across the Philippines.
            It is also a community-driven platform to share public information from local to national projects, ordinances, announcement
            and other information may able to use for researches and other related educational activities.
          </blockquote>
        </CollapsableCard>
        <CollapsableCard summary="Why we do this?">
          <blockquote>
            &emsp;We want to give freedom to people, from the issues of unfinished flood controls, issues in traffic and flood, crimes.
            We want to make every citizen well-informed from a shared information gathered by each person, from student, professionals or even a normal
            Lucenahin. We want to tell to people not to rebel, but to give people knowledge what happen to Lucena City.
          </blockquote>
        </CollapsableCard>
        <CollapsableCard summary="How do we publish information?">
          <blockquote>
            &emsp;By publishing information, we filter it and analyzes it. Meaning we carefully taking time to research for a certain information,
            looking for its relevance not just based on the given source, but also for the other sources related to the topic.
            We have data collectors who are responsible to gather data from any public source, we also have data validator to check its relevance and
            authenticity to prevent public misinformation. We also include the source in published information so that even normal Lucenahin
            may able to do fact checking, and report it once the information is misleading or not.
          </blockquote>
        </CollapsableCard>
        <CollapsableCard summary="Non Partisan Policy">
          <blockquote>
            &emsp;We want to make each contributor a non partisan, or basically no political bias. This will help us to decide if we will going to
            easily validate the information. This may able to protect someone's political perspective. Also the BetterLucenaCity wanted to tell that
            each project created were came from the tax of everyone, we don't need to thank them, it is their responsibility as public officials.
          </blockquote>
        </CollapsableCard>
      </section>
    </div>
  )
}
