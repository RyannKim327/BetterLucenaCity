import { PageHeader } from "@/components/layout/page-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procurement",
  keywords: [
    "Lucena City Project Procurement",
    "Lucena City Project Bidding",
  ],
  authors: [
    {
      name: "RyannKim327",
      url: "https://github.com/RyannKim327"
    }
  ]
};

export default function Procurement() {
  return (
    <div>
      <PageHeader
        eyebrow="Mga pangalapan o pagbili"
        title="Procurement"
        description="Public bidding notices, awarded contracts, and supplier information." />
    </div>
  )
}
