import { eq } from "drizzle-orm";
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

export async function getTherapistData(){
  return await db
    .select({
      userId: users.userId,
      firstName: users.firstName,
      lastName: users.lastName,
      age: users.age,
      gender: users.gender,
      email: users.email,
      specialty: therapists.specialty,
      accepting: therapists.accepting,
      relationshipId: relationships.relationshipId,
      status: relationships.status
    })
    .from(users)
    .innerJoin(therapists, eq(users.userId, therapists.therapistId))
    .innerJoin(relationships, eq(users.userId, relationships.relationshipId))
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
