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

export function formatName({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  return `${firstName} ${lastName}`;
}

export function formatInitials({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  return `${firstName[0]}${lastName[0]}`;
}

export function formatInitialsByString(str: string) {
  return str
    .split(" ")
    .map((chunk) => chunk[0])
    .join("");
}

export function containsQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export const doHyeon = Do_Hyeon({ weight: "400", subsets: ["latin"] });
