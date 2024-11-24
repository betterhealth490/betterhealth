import { clsx, type ClassValue } from "clsx";
import { Do_Hyeon } from "next/font/google";
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

export const doHyeon = Do_Hyeon({ weight: "400", subsets: ["latin"] });
