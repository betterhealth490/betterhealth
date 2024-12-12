import { z } from "zod"
import { availability } from "~/db/schema"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  name: z.string(),
  email: z.string(),
  age: z.string(),
  gender: z.string(),
  specialty: z.string(),
  available: z.string()
})

export type Task = z.infer<typeof taskSchema>