"use client"

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import React, { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/data/site";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "./profile-menu";
import { User } from "lucide-react";

type DropdownLink = {
  href: string;
  label: string;
  Icon: typeof User;
  perm?: string; // if undefined, always visible
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visibleNav, setVisibleNav] = useState(false)
  const [orderedLinks, setOrderedLinks] = useState<DropdownLink[]>([])
  const [auth, setAuth] = useState(false)

  return (
    <div>
      <Header setVisibleNav={setVisibleNav} visibleNav={visibleNav} auth={auth} />
      <div className="flex flex-row w-full overflow-x-hidden">
        <main className={`w-full overflow-hidden`}>{children}</main>
        <div className={`${visibleNav ? "flex flex-col justify-between h-[calc(85%-1rem)] w-full md:w-[calc(35%-1rem)] fixed z-10 bg-surface-container-high right-0 top-30 bottom-0" : "w-0 overflow-hidden"} transition-all delay-75`}>
          <nav aria-label="Primary" className="w-full p-2 overflow-y-auto">
            <ul className="flex flex-col w-full items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <li
                    onClick={() => { setVisibleNav(false) }}
                    key={link.href}
                    className="w-full">
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
              {orderedLinks && orderedLinks.map(l => {
                return (
                  <li
                    onClick={() => { setVisibleNav(false) }}
                    key={l.href}
                    className="w-full">
                    <Link
                      href={l.href}
                      className={`inline-flex w-full h-10 items-center rounded px-4 text-sm transition-colors ${"text-on-surface-variant hover:bg-primary/8"
                        }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <ProfileMenu setAuth={setAuth} setOrderedLinks={setOrderedLinks} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
