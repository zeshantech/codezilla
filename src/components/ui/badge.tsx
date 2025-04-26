import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/10 text-primary [a&]:hover:bg-primary/90",
        secondary:
          "border-secondary/30 bg-secondary/10 text-secondary [a&]:hover:bg-secondary/90",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        error:
          "border-error/30 bg-error/10 text-error [a&]:hover:bg-error/20 focus-visible:ring-error/20 dark:focus-visible:ring-error/40",
        warning:
          "border-warning/30 bg-warning/10 text-warning [a&]:hover:bg-warning/20 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
        info: "border-info/30 bg-info/10 text-info [a&]:hover:bg-info/20 focus-visible:ring-info/20 dark:focus-visible:ring-info/40",
        success:
          "border-success/30 bg-success/10 text-success [a&]:hover:bg-success/20 focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        muted:
          "border-muted bg-muted text-muted-foreground [a&]:hover:bg-muted/20 focus-visible:ring-muted/20 dark:focus-visible:ring-muted/40",
      },
      mode: {
        default: "",
        solid: "border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
      mode: "default",
    },
  }
);

function Badge({
  className,
  variant,
  mode,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, mode }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
