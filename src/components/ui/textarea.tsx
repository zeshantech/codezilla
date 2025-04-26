import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Info } from "./info";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string;
  error?: string;
  info?: string;
  container?: {
    className: string;
  };
}

function Textarea({
  className,
  label,
  error,
  info,
  container,
  ...props
}: TextareaProps) {
  return (
    <div className={cn("space-y-2", container?.className)}>
      {label && (
        <Label className="flex gap-1 items-center">
          {label}{" "}
          {props.required && <span className="text-destructive">*</span>}
          {info && <Info tooltip={info} />}
        </Label>
      )}
      <textarea
        data-slot="textarea"
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
      {error && <span className="text-sm text-error">{error}</span>}
    </div>
  );
}

Textarea.displayName = "Textarea";

export { Textarea };
