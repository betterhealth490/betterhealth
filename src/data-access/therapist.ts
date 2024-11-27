import { eq, and, or, SQL } from "drizzle-orm";
import { string } from "zod";
import { db } from "~/db";
import { users, therapistPatient } from "~/db/schema";
import {
  ListTherapistInput,
  ListTherapistResult,
  ListUserTherapistInput,
  ListUserTherapistResult,
  UpdateTherapistStatusInput,
  UpdateTherapistStatusResult,
} from "~/entities/therapist";

export async function listTherapist(
  input: ListTherapistInput,
): Promise<ListTherapistResult> {
  const result = await db
    .select({
      firstName: users.firstName,
      lastName: users.lastName,
      isVerified: users.isVerified,
      email: users.email
    })
    .from(users)
    .where(
      or(
        eq(users.role, input.role),
        eq(users.firstName, input.firstName),
        eq(users.lastName, input.lastName),
        eq(users.email, input.email),
      )
    );
  return result;
}

//List therapists that the user has had since registering
export async function listUserTherapist(
  input: ListUserTherapistInput,
): Promise<ListUserTherapistResult> {
  const result = await db
    .select({
      therapistId: therapistPatient.therapistId,
      firstName: users.firstName,
      lastName: users.lastName,
      isVerified: users.isVerified,
      status: therapistPatient.status,
      createdAt: therapistPatient.createdAt,
      updatedAt: therapistPatient.updatedAt,
    })
    .from(therapistPatient)
    .innerJoin(users, eq(users.userId, therapistPatient.therapistId))
    .where(eq(therapistPatient.patientId, input.userId));

  return result;
}

export async function setTherapistStatus(
  input: UpdateTherapistStatusInput,
): Promise<UpdateTherapistStatusResult> {
  const result = await db
    .update(users)
    .set({ active: input.active })
    .where(eq(users.userId, input.therapistId))
    .returning();

  const update = result.at(0);
  if (update) {
    return update;
  } else {
    throw new Error("Could Not Update");
  }
}


