"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, XIcon } from "lucide-react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onSearch?: (value: string) => void;
  disabled?: boolean;
  onClear?: () => void;
  inputClassName?: string;
}

export function SearchInput({ className, placeholder = "Search...", value, onChange, onSearch, onClear, disabled = false, inputClassName, ...props }: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch && value) {
      onSearch(value);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        className={cn(
          "h-9 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          value ? "pr-8" : "pr-4",
          inputClassName
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        {...props}
      />
      {value && onClear && (
        <button type="button" onClick={onClear} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
