"use client"
import type { CardProps } from "@/types/ui";

interface CollapsableCardProps extends CardProps {
  summary: string
}

export function CollapsableCard({ summary, children, className, hover }: CollapsableCardProps) {
  return (
    <details
      className={`rounded-card border border-outline-variant/40 bg-surface-container-low p-6 shadow-elevation-1 transition-shadow hover:shadow-elevation-2 cursor-pointer ${hover
        ? "hover:border-primary"
        : ""
        } ${className ?? ""}`}
    >
      <summary className="cursor-pointer">{summary}</summary>
      {children}
    </details>
  );
}

