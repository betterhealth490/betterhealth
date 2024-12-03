import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "~/db";
import { therapistPatient, users } from "~/db/schema";

export async function listTherapistByPatient({
  patientId,
  limit = 5,
  offset = 0,
}: {
  patientId: number;
  limit?: number;
  offset?: number;
}) {
  const patients = alias(users, "patients");
  const therapists = alias(users, "therapists");

  return await db
    .select({
      patient: {
        id: patients.userId,
        firstName: patients.firstName,
        lastName: patients.lastName,
      },
      therapist: {
        id: therapists.userId,
        firstName: therapists.firstName,
        lastName: therapists.lastName,
      },
    })
    .from(therapistPatient)
    .innerJoin(patients, eq(patients.userId, therapistPatient.patientId))
    .innerJoin(therapists, eq(therapists.userId, therapistPatient.therapistId))
    .where(eq(therapistPatient.patientId, patientId))
    .limit(limit)
    .offset(offset);
}
