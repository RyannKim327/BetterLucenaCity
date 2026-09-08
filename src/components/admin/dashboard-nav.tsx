"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Users, ShieldAlert } from "lucide-react";

type Props = {
  variant: "admin" | "maintainer";
};

export function DashboardNav({ variant }: Props) {
  const pathname = usePathname();
  const base = variant === "admin" ? "/admin" : "/maintainer";

  const links = [
    {
      href: base,
      label: "Pending",
      desc: "Approve",
      Icon: Clock,
    },
    {
      href: `${base}/users`,
      label: variant === "admin" ? "Users" : "Users",
      desc: variant === "admin" ? "Restrict & Roles" : "Restrict",
      Icon: variant === "admin" ? ShieldAlert : Users,
    },
  ];

  return (
    <nav aria-label={`${variant} navigation`} className="mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary-container px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-on-primary-container">
            {variant === "admin" ? "Head Maintainer" : "Maintainer"}
          </span>
          <span className="text-xs text-on-surface-variant">Dashboard</span>
        </div>
        <div className="flex gap-1 rounded-full border border-outline-variant/40 bg-surface-container-low p-1">
          {links.map(({ href, label, desc, Icon }) => {
            // exact match for base, prefix match for users
            const isActive = href === base ? pathname === base : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-on-primary font-semibold shadow-elevation-1"
                    : "text-on-surface-variant hover:bg-primary/8 hover:text-on-surface"
                }`}
              >
                <Icon size={16} strokeWidth={1.8} aria-hidden />
                <span>{label}</span>
                <span className={`hidden text-[11px] font-normal sm:inline ${isActive ? "text-on-primary/80" : "text-on-surface-variant"}`}>
                  · {desc}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-4 h-px bg-outline-variant/30" />
    </nav>
  );
}
