import React, { cloneElement, ReactElement } from "react";
import { AlertCircle, LucideProps } from "lucide-react";
import { ButtonProps } from "@/components/ui/button";

export function EmptyState({ title, description, icon, button }: { title?: string; description?: string; icon: ReactElement<LucideProps>; button?: ReactElement<ButtonProps> }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        {cloneElement(icon, {
          className: "size-6 text-muted-foreground",
        })}
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      {button && cloneElement(button, { className: "mt-4" })}
    </div>
  );
}

export function ErrorState({ title = "Oops! Something went wrong.", description = "Something went wrong while fetching the data. Please try again later.", icon = <AlertCircle /> }: { title?: string; description?: string; icon?: ReactElement<LucideProps> }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        {cloneElement(icon ?? <AlertCircle />, {
          className: "size-6 text-muted-foreground",
        })}
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
