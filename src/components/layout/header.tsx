"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/data/site";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import Hotlines from "./hotlines";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-outline-variant/40 shadow-elevation-1">
      <Hotlines />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Image
              src="/better-lucena-city.svg"
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
            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`inline-flex h-10 items-center rounded-full px-4 text-sm transition-colors ${active
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

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="inline-flex size-11 items-center justify-center rounded-full text-on-surface hover:bg-primary/8 md:hidden"
            >
              <span className="sr-only">Toggle navigation</span>
              {open ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-outline-variant/40 bg-background md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm ${active
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
      )}
    </header>
  );
}
