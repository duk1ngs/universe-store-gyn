"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function ShinyButtonContent({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("shiny-cta-content", className)} {...props} />;
}

export function shinyButtonClassName(className?: string) {
  return cn("shiny-cta", className);
}

export function ShinyButton({ children, className, type = "button", ...props }: React.ComponentProps<"button">) {
  return (
    <button type={type} className={shinyButtonClassName(className)} {...props}>
      <ShinyButtonContent>{children}</ShinyButtonContent>
    </button>
  );
}

export default ShinyButton;
