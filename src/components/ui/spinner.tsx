import React from "react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const spinnerVariants = cva("flex-col items-center justify-center", {
  variants: {
    show: {
      true: "flex",
      false: "hidden",
    },
    size: {
      small: "text-xs",
      medium: "text-sm",
      large: "text-base",
      xlarge: "text-lg",
    },
  },
  defaultVariants: {
    show: true,
    size: "medium",
  },
});

const loaderVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      small: "size-6",
      medium: "size-8",
      large: "size-12",
      xlarge: "size-16",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface SpinnerContentProps extends VariantProps<typeof spinnerVariants>, VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Spinner({ size, show, children, className }: SpinnerContentProps) {
  return (
    <span className={cn(spinnerVariants({ show, size }))}>
      <Loader2 className={cn(loaderVariants({ size }), className)} />
      <div className={cn("mt-2 text-muted-foreground", spinnerVariants({ size }))}>{children}</div>
    </span>
  );
}

export function SpinnerBox({ size, show, children, className }: SpinnerContentProps) {
  return (
    <div className={cn("flex items-center justify-center h-full", className)}>
      <Spinner size={size} show={show}>
        {children}
      </Spinner>
    </div>
  );
}

interface SpinnerBackdropProps extends SpinnerContentProps {
  fullScreen?: boolean;
}

export function SpinnerBackdrop({ size, show, children, className, fullScreen = false }: SpinnerBackdropProps) {
  return (
    <div className={cn("flex items-center justify-center bg-background/80 backdrop-blur-sm", fullScreen ? "fixed inset-0" : "absolute inset-0 rounded-md", show ? "flex" : "hidden")}>
      <Spinner size={size} show={show} className={className}>
        {children}
      </Spinner>
    </div>
  );
}
