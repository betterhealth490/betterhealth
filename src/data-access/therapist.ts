import { eq, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "~/db";
import { therapistPatient, users, availability } from "~/db/schema";

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

export async function therapistAvailability({
  therapistId,
  date,
}: {
  therapistId: number;
  date: string;
}) {
  return await db
    .select({
      availabilityId: availability.availabilityId,
      startTime: availability.startTime,
      endTime: availability.endTime,
      isBooked: availability.isBooked,
    })
    .from(availability)
    .where(
      and(
        eq(availability.therapistId, therapistId),
        eq(availability.availableDate, date),
        eq(availability.isBooked, false),
      ),
    );
}

export async function bookAvailabilitySlot({
  availabilityId,
}: {
  availabilityId: number;
}) {
  return await db
    .update(availability)
    .set({ isBooked: true })
    .where(eq(availability.availabilityId, availabilityId));
}

export async function setTherapistAvailability({
  therapistId,
  availableDate,
  startTime,
  endTime,
}: {
  therapistId: number;
  availableDate: string;
  startTime: string;
  endTime: string;
}) {
  return await db.insert(availability).values({
    therapistId,
    availableDate,
    startTime,
    endTime,
  });
}
