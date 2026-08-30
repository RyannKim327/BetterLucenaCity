import type { ReactNode } from "react";

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "filled" | "tonal" | "outlined" | "text";
  className?: string;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export interface AuthButtonsProps {
  redirectTo: string;
  message?: string;
}
