import Link from "next/link";
import { emergencyHotlines } from "@/lib/data/announcements";
import { navLinks, site } from "@/lib/data/site";
import { hotlines } from "@/lib/data/hotlines";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-outline-variant/40 bg-surface-container">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-base font-semibold">
            {site.name} — {site.locality}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-on-surface-variant">
            {site.description}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
            {site.cityHallAddress}
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            Navigate
          </p>
          <ul className="mt-3 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-on-surface hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            Emergency Hotlines
          </p>
          <ul className="mt-3 space-y-2">
            {hotlines.map((hotline) => (
              <li key={hotline.name} className="text-sm">
                <span className="text-on-surface-variant">{hotline.name}: </span>
                <a href={`tel:${hotline.dial.join(" ").replace(/[^+\d]/g, "")}`} className="font-medium hover:text-primary">
                  {hotline.dial.join(" | ")}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-outline-variant/40 py-4">
        <div className="flex flex-wrap justify-between mx-auto max-w-6xl px-4 text-xs text-on-surface-variant sm:px-6">
          <p>© {new Date().getFullYear()} {site.name} · {site.tagline}</p>
          <Link href="/contribute">Be one of us? Be a contributor?</Link>
        </div>
      </div>
    </footer >
  );
}
