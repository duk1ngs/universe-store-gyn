import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const universeButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4",
  {
    variants: {
      size: {
        compact: "min-h-8 px-2",
        default: "min-h-11 px-4",
      },
    },
    defaultVariants: { size: "default" },
  },
);

function UniverseButton({ className, size, type = "button", ...props }: React.ComponentProps<"button"> & VariantProps<typeof universeButtonVariants>) {
  return <button type={type} className={cn(universeButtonVariants({ size }), className)} {...props} />;
}

export { UniverseButton, universeButtonVariants };
