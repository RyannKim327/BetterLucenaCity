import type { CardProps } from "@/types/ui";

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={`rounded-card bg-surface-container-low border border-outline-variant/40 p-6 shadow-elevation-1 transition-shadow hover:shadow-elevation-2 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
