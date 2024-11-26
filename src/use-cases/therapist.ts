import { eq, and } from "drizzle-orm";
import { db } from "~/db";
import { users, therapistPatient } from "~/db/schema";
import {
  ListTherapistInput,
  ListTherapistItem,
  ListTherapistResult,
  ListUserTherapistInput,
  ListUserTherapistItem,
  ListUserTherapistResult,
} from "~/entities/therapist";

export async function listTherapist(
  input: ListTherapistInput,
): Promise<ListTherapistResult> {
  const result = await db
    .select({
      firstName: users.firstName,
      lastName: users.lastName,
      isVerified: users.isVerified,
    })
    .from(users)
    .where(
      and(
        eq(users.userId, input.userId),
        // eq(users.licenseNumber, input.licenseNumber)
      ),
    );
  return result;
}

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
