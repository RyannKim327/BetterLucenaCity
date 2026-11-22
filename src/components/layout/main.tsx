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
  const [orderedLinks, setOrderedLinks] = useState<DropdownLink[] | null>(null)
  const [auth, setAuth] = useState(false)

  return (
    <div className="h-full w-full overflow-x-hidden">
      <Header setVisibleNav={setVisibleNav} visibleNav={visibleNav} auth={auth} />
      {children}
      <div
        onClick={() => {
          setVisibleNav(false)
        }}
        className={`${visibleNav ? "fixed z-5 top-0 right-0 left-0 bottom-0 bg-surface-dim/75 opacity-100" : "hidden opacity-0"} transition-all delay-75`}></div>
      <div
        className={`flex flex-col justify-between pt-30 h-full w-full md:w-[calc(35%-1rem)] fixed z-10 bg-surface-container-high top-0 bottom-0 ${visibleNav ? "right-0" : "-right-full md:-right-[calc(35%-1rem)] overflow-hidden"} transition-all delay-75`}>
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
            {orderedLinks && orderedLinks.length > 0 &&
              <div className="p-px bg-on-surface-variant w-full" />}
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
      <Footer />
    </div>
  )
}
