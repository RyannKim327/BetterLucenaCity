"use client"
import type { CardProps } from "@/types/ui";

export function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={`rounded-card border border-outline-variant/40 bg-surface-container-low p-6 shadow-elevation-1 transition-shadow hover:shadow-elevation-2 ${hover
        ? "cursor-pointer hover:border-primary"
        : ""
        } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

