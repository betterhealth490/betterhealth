import { z } from "zod";

export const memberFormSchema = z.object({
  firstName: z
    .string()
    .min(3, "Must have 3+ characters")
    .max(100, "Must have <100 characters"),
  lastName: z
    .string()
    .min(3, "Must have 3+ characters")
    .max(100, "Must have <100 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const therapistFormSchema = z.object({
  firstName: z
    .string()
    .min(3, "Must have 3+ characters")
    .max(100, "Must have <100 characters"),
  lastName: z
    .string()
    .min(3, "Must have 3+ characters")
    .max(100, "Must have <100 characters"),
  licenseNumber: z
    .string()
    .regex(/46TR[0-9]{6}00/, "Enter a valid license number")
    .length(12),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
