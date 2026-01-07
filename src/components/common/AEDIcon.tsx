"use client";

import { cn } from "@/lib/utils";

interface AEDIconProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function AEDIcon({ className, size = "sm" }: AEDIconProps) {
  return (
    <span
      className={cn(sizeClasses[size], "inline-block font-medium", className)}
      aria-label="AED"
    >
      د.إ
    </span>
  );
}
