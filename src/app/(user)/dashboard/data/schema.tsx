import { z } from "zod"
import { genderEnum, specialtyEnum } from "~/db/schema"

export const taskSchema = z.object({
  name: z.string(),
  email: z.string(),
  age: z.number().int().nullable(),
  gender: z.enum(genderEnum.enumValues).nullable(),
  specialty: z.enum(specialtyEnum.enumValues).nullable(),
  status: z.enum(["current", "pending", "available", "inactive"])
})

export type Task = z.infer<typeof taskSchema>