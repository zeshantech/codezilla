import * as React from "react";
import { cn } from "@/lib/utils";
import { ButtonProps } from "./button";

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  orientation?: "horizontal" | "vertical";
  children: React.ReactElement<ButtonProps>[];
}

function ButtonGroup({ className, variant = "default", size = "default", orientation = "horizontal", children, ...props }: ButtonGroupProps) {
  return (
    <div className={cn("inline-flex gap-px overflow-hidden rounded-md", orientation === "vertical" && "flex-col", className)} data-orientation={orientation} {...props}>
      {children.map((child) => {
        return React.cloneElement(child, {
          className: cn("rounded-none", child.props.className),
          size: child.props.size || size,
          variant: child.props.variant || variant,
        });
      })}
    </div>
  );
}

export { ButtonGroup };
