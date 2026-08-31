import ContributorContainer from "@/app/(contribute)/layout";
import { ReactNode } from "react";

export default function ContributeLayout({ children }: { children: ReactNode }) {
  return (
    <ContributorContainer>
      {children}
    </ContributorContainer>
  )
}
