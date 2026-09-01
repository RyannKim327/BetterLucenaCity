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
    <div className="flex flex-col mx-auto max-w-6xl gap-4 px-4 py-16 sm:px-6">
      {children}
    </div>
  )
}
