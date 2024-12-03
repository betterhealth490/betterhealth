import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "~/db";
import { therapistPatient, users } from "~/db/schema";

export async function listTherapistsByMember({
  memberId,
  limit = 5,
  offset = 0,
}: {
  memberId: number;
  limit?: number;
  offset?: number;
}) {
  const members = alias(users, "members");
  const therapists = alias(users, "therapists");

  return await db
    .select({
      patient: {
        id: members.userId,
        firstName: members.firstName,
        lastName: members.lastName,
      },
      therapist: {
        id: therapists.userId,
        firstName: therapists.firstName,
        lastName: therapists.lastName,
      },
    })
    .from(therapistPatient)
    .innerJoin(members, eq(members.userId, therapistPatient.patientId))
    .innerJoin(therapists, eq(therapists.userId, therapistPatient.therapistId))
    .where(eq(therapistPatient.patientId, memberId))
    .limit(limit)
    .offset(offset);
}
