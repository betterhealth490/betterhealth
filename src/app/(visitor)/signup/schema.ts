import { z } from "zod";

export const memberFormSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const therapistFormSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    licenseNumber: z
        .string()
        .regex(/46TR[0-9]{6}00/, "Enter a valid license number"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
