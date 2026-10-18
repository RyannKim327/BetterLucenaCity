"use client"

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import React, { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/data/site";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "./profile-menu";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visibleNav, setVisibleNav] = useState(false)

  return (
    <div>
      <Header setVisibleNav={setVisibleNav} visibleNav={visibleNav} />
      <div className="flex flex-row w-full overflow-x-hidden">
        <main className={` ${visibleNav ? "w-[calc(95%-1rem)]" : "w-full"} transition-all delay-75`}>{children}</main>
        <div className={`${visibleNav ? "flex flex-col justify-between h-[calc(85%-1rem)] w-full md:w-[calc(25%-1rem)] fixed z-10 bg-surface-container-high right-0 top-30 bottom-0" : "w-0 overflow-hidden"} transition-all delay-75`}>
          <nav aria-label="Primary" className="w-full p-2">
            <ul className="flex flex-col w-full items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href} className="w-full">
                    <Link
                      href={link.href}
                      className={`inline-flex w-full h-10 items-center rounded px-4 text-sm transition-colors ${active
                        ? "bg-primary-container text-on-primary-container font-semibold"
                        : "text-on-surface-variant hover:bg-primary/8"
                        }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <ProfileMenu />
        </div>
      </div>
      <Footer />
    </div>
  )
}
