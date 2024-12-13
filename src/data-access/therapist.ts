import { eq, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "~/db";
import { relationships, users, availability } from "~/db/schema";

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
    .from(relationships)
    .innerJoin(patients, eq(patients.userId, relationships.patientId))
    .innerJoin(therapists, eq(therapists.userId, relationships.therapistId))
    .where(eq(relationships.patientId, patientId))
    .limit(limit)
    .offset(offset);
}

export async function listAvailability({
  therapistId,
  date,
}: {
  therapistId: number;
  date: number;
}) {
  return await db
    .select({
      availabilityId: availability.availabilityId,
      startTime: availability.startTime,
      endTime: availability.endTime,
    })
    .from(availability)
    .where(
      and(
        eq(availability.therapistId, therapistId),
        eq(availability.day, date),
      ),
    );
}



export async function setTherapistAvailability({
  therapistId,
  day,
  startTime,
  endTime,
}: {
  therapistId: number;
  day: number;
  startTime: string;
  endTime: string;
}) {
  return await db.insert(availability).values({
    therapistId,
    day,
    startTime,
    endTime,
  });
}
