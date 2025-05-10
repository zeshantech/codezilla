import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a currency string (USD).
 * @param amount The number to format.
 * @returns A formatted currency string (e.g., $1,234.56).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * A no-operation function that can be used as a default value for callbacks.
 * @param args - Any arguments passed to the function (which will be ignored).
 * @returns Nothing.
 */
export function noop(..._: any[]): void {
  // This function intentionally does nothing
  return;
}

/**
 * Serializes a Mongoose document or array of documents to a plain JavaScript object.
 * @param data - The data to serialize.
 * @returns The serialized data.
 */
export const serialize = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((doc) => doc.toJSON());
  } else if (data && typeof data.toJSON === "function") {
    return data.toJSON();
  }
  return data;
};

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced version of the provided function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

/**
 * Safely converts a string representation of a boolean to an actual boolean value.
 * Returns undefined if the string is not "true" or "false".
 * @param value The string value to convert to boolean.
 * @returns A boolean value if the string is "true" or "false", otherwise undefined.
 */
export function stbConverter(value?: string): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}
