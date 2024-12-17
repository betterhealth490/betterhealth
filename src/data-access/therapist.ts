import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "~/db";
import {
  users,
  availability,
  relationships,
  type genderEnum,
  type specialtyEnum,
  therapists,
} from "~/db/schema";
import { isDefined } from "~/lib/utils";

export async function getTherapist(therapistId: number) {
  const result = await db
    .select()
    .from(therapists)
    .where(eq(therapists.therapistId, therapistId));

  const therapist = result.at(0);

  if (therapist) {
    return therapist;
  } else {
    throw new Error("No journal found");
  }
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

export async function changeStatus({
  therapistId,
  accepting,
}: {
  therapistId: number;
  accepting: boolean;
}) {
  const [result] = await db
    .update(therapists)
    .set({
      accepting,
      updatedAt: new Date(),
    })
    .where(eq(therapists.therapistId, therapistId))
    .returning();
  if (!isDefined(result)) {
    throw new Error("Error updating therapist: " + therapistId);
  }
  return result;
}

export async function updateProfile({
  userId,
  options,
}: {
  userId: number;
  options: {
    firstName?: string;
    lastName?: string;
    email?: string;
    age?: number | null;
    gender?: (typeof genderEnum.enumValues)[number] | null;
  };
}) {
  const [result] = await db
    .update(users)
    .set({
      ...options,
      updatedAt: new Date(),
    })
    .where(eq(users.userId, userId))
    .returning();
  if (!isDefined(result)) {
    throw new Error("Error updating user: " + userId);
  }
  return result;
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
    .where(eq(therapists.therapistId, therapistId))
    .returning();
  if (!isDefined(result)) {
    throw new Error("Error updating therapist specialty: " + therapistId);
  }
  return result;
}

export async function acceptPatient({
  therapistId,
  patientId,
}: {
  therapistId: number;
  patientId: number;
}) {
  const [result] = await db
    .update(relationships)
    .set({
      status: "approved",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(relationships.therapistId, therapistId),
        eq(relationships.patientId, patientId),
      ),
    )
    .returning();
  if (!isDefined(result)) {
    throw new Error("Error accepting request: " + patientId);
  }
  return result;
}

export async function declinePatient({
  therapistId,
  patientId,
}: {
  therapistId: number;
  patientId: number;
}) {
  const request = await db
    .delete(relationships)
    .where(
      and(
        eq(relationships.patientId, patientId),
        eq(relationships.therapistId, therapistId),
      ),
    )
    .returning();
  if (!isDefined(request)) {
    throw new Error("Error deleting relationship");
  }
}
