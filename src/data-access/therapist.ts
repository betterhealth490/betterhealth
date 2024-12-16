import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "~/db";
import {
  users,
  availability,
  relationships,
  type specialtyEnum,
  therapists,
} from "~/db/schema";
import { isDefined } from "~/lib/utils";

export async function changeTherapistStatus({
  therapistId,
  active,
}: {
  therapistId: number;
  active: boolean;
}) {
  const [therapist] = await db
    .update(therapists)
    .set({
      active,
      updatedAt: new Date(),
    })
    .where(and(eq(therapists.therapistId, therapistId)))
    .returning();

  if (!therapist) {
    throw new Error("Failed to update therapist");
  }
  if (active) {
    return therapists;
  }

  await db
    .delete(relationships)
    .where(and(eq(relationships.therapistId, therapistId)))
    .returning();
}

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
}: {
  therapistId: number;
}) {
  return await db
    .select({
      availabilityId: availability.availabilityId,
      day: availability.day,
      startTime: availability.startTime,
      endTime: availability.endTime,
    })
    .from(availability)
    .where(eq(availability.therapistId, therapistId));
}

export async function updateSpecialty({
  therapistId,
  specialty,
}: {
  therapistId: number;
  specialty: (typeof specialtyEnum.enumValues)[number] | undefined;
}) {
  const [result] = await db
    .update(therapists)
    .set({
      specialty,
      updatedAt: new Date(),
    })
    .where(
      and(eq(therapists.therapistId, therapistId), eq(therapists.active, true)),
    )
    .returning();
  if (!isDefined(result)) {
    throw new Error("Error updating therapist specialty: " + therapistId);
  }
  return result;
}
