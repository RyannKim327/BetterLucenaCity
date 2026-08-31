import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface AdminContainerInterface {
  children: ReactNode
}

export default function AdminContainer({ children }: AdminContainerInterface) {

  const isAdmin = true

  if (!isAdmin) {
    redirect("/")
  }

  return (
    <>
      {children}
    </>
  )
}
