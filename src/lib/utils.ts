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
export function noop(...args: any[]): void {
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
