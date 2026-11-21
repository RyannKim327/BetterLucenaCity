import { PageHeader } from "@/components/layout/page-header";
import { CollapsableCard } from "@/components/ui/collapsable-card";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "About Us",
  description: "About BetterLucenaCity. Some shared basic information about us.",
  keywords: [
    "About Better Lucena City",
    "Better Lucena City About Us",
    "Lucenahin",
    "Better Lucena City Logo",
  ],
  authors: [
    {
      name: "RyannKim327",
      url: "https://github.com/RyannKim327"
    },
    {
      name: "Kurt Atoat",
      url: "https://github.com/seiyanndev"
    }
  ]
};

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Tungkol sa amin"
        title="About Us"
        description="About BetterLucnaCity. Some shared basic information about us."
      />
      <section className="flex flex-col gap-2 mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <CollapsableCard summary="About the Logo">
          <img src="/better-lucena-city-branding.png" />
        </CollapsableCard>
        <CollapsableCard summary="Better Lucena City">
          <blockquote className="text-justify">
            &emsp;Better Lucena City is part of BetterGov.ph,
            a community-maintained directory of digital transparency portals from LGUs across the Philippines.
            As a community-driven platform for our city,
            we gather and share public information on local projects, ordinances, announcements, and other matters that shape our community.
            We believe this information should be freely accessible to every Lucenahin,
            so that students, researchers, and every citizen can use it for research, education, and for understanding how our city is being run.
          </blockquote>
        </CollapsableCard>
        <CollapsableCard summary="Why we do this?">
          <blockquote className="text-justify">
            &emsp;Our goal is to let the people move past the struggles of unfinished flood controls, traffic congestion and flooding, and crime.
            We believe every citizen should be well-informed, and that starts with sharing information gathered by everyone:
            students, professionals, and every ordinary Lucenahin.
            Instead of turning to unrest, we want to give the people the knowledge they need to understand what is happening in Lucena City.
          </blockquote>
        </CollapsableCard>
        <CollapsableCard summary="How do we publish information?">
          <blockquote className="text-justify">
            &emsp;We believe that information should be carefully examined before it reaches the public.
            That is why we take the time to filter and analyze every detail,
            looking beyond the original source to other related materials to ensure relevance and accuracy.
            Our data collectors gather information from various public sources,
            while our data validators check its authenticity and relevance to protect our community from misinformation.
            By including the sources in everything we publish,
            we empower even the ordinary Lucenahin to do their own fact-checking and report anything they find misleading or untrue.
          </blockquote>
        </CollapsableCard>
        <CollapsableCard summary="Non Partisan Policy">
          <blockquote className="text-justify">
            &emsp;We believe that every contributor should remain non-partisan and free from political bias.
            This helps us validate information more easily and fairly, while respecting the political views of every Lucenahin.
            BetterLucenaCity also wants to remind everyone that every project is funded by the taxes of the people.
            We do not need to thank public officials for doing their job; serving the community is simply their responsibility.
          </blockquote>
        </CollapsableCard>
      </section>
    </div>
  )
}
