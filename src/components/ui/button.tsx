import Link from "next/link";
import type { ButtonProps } from "@/types/ui";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 h-12 text-sm font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const variants = {
  filled: "bg-primary text-on-primary hover:bg-primary/90 shadow-elevation-1",
  tonal:
    "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80",
  outlined:
    "border border-outline text-primary hover:bg-primary/8",
  text: "text-primary hover:bg-primary/8 px-4",
} as const;

export function Button({ href, children, variant = "filled", className }: ButtonProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className ?? ""}`}>
      {children}
    </Link>
  );
}
