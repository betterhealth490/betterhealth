import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isDefined<T>(value: T) {
  return value !== null && value !== undefined;
}

export function isNullOrUndefined<T>(value: T) {
  return value === null || value === undefined;
}
