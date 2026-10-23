"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Menu, X } from "lucide-react";
import { site } from "@/lib/data/site";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import Hotlines from "./hotlines";

export function Header({ setVisibleNav, visibleNav, auth }: { setVisibleNav: (b: any) => void, visibleNav: boolean, auth: boolean }) {

  return (
    <header className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-outline-variant/40 shadow-elevation-1">
      <Hotlines />
      <div className="flex justify-end max-w-6xl gap-2 text-xs p-1 px-2 sm:px-6">
        <Link href="/contributors">Join Us</Link>
        <Link href="https://bettergov.ph">BetterGov.PH</Link>
        <Link href="/about">About Us</Link>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" onClick={() => setVisibleNav(false)}>
            <Image
              src="/blc-logo.png"
              alt="Better Lucena City logo — map of Lucena with sunrise and fisheries"
              width={36}
              height={36}
              priority
            />
            <span className="leading-tight">
              <span className="block text-sm font-semibold">{site.name}</span>
              <span className="block text-xs text-on-surface-variant">
                {site.locality}, {site.province}
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            {auth ?
              <Bell />
              : null}
            <button
              type="button"
              onClick={() => setVisibleNav((v: boolean) => !v)}
              aria-expanded={visibleNav}
              aria-controls="mobile-nav"
              className="inline-flex size-11 items-center justify-center rounded-full text-on-surface hover:bg-primary/8"
            >
              <span className="sr-only">Toggle navigation</span>
              {visibleNav ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
