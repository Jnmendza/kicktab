import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export function formatString(input: string): string {
  return input.toLowerCase().replace(/\s+/g, "-");
}

export function capitalizeFirstLetter(input: string | null): string {
  if (input === null) {
    return "N/A";
  }
  if (input.length !== 3 || !/^[A-Z]{3}$/.test(input)) {
    throw new Error("Input must be a string of 3 capitalized characters");
  }
  return input.charAt(0) + input.slice(1).toLowerCase();
}
