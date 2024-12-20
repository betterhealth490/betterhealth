import { db } from "~/db";
import { eq, and } from "drizzle-orm";
import {
  users,
  therapistComments,
  type ageEnum,
  type genderEnum,
  type specialtyEnum,
  relationships,
  patients,
  therapists,
} from "~/db/schema";
import {
  type SelectTherapistInput,
  type SelectTherapistResult,
  type ChangeTherapistInput,
  type ChangeTherapistResult,
  type GetPatientTherapistInput,
  type GetPatientTherapistResult,
} from "~/entities/patient";
import { alias } from "drizzle-orm/pg-core";
import { isDefined } from "~/lib/utils";

export async function getPatient({ patientId }: { patientId: number }) {
  const result = await db
    .select({
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      password: users.password,
      agePreference: patients.agePreference,
      genderPreference: patients.genderPreference,
      specialtyPreference: patients.specialtyPreference,
    })
    .from(users)
    .innerJoin(patients, eq(users.userId, patients.patientId))
    .where(eq(users.userId, patientId));
  return result.at(0);
}

export async function getTherapist({ therapistId }: { therapistId: number }) {
  const result = await db
    .select({
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      password: users.password,
      gender: users.gender,
      specialty: therapists.specialty,
    })
    .from(users)
    .innerJoin(therapists, eq(users.userId, therapists.therapistId))
    .where(eq(users.userId, therapistId));
  return result.at(0);
}

export async function selectTherapist(
  input: SelectTherapistInput,
): Promise<SelectTherapistResult> {
  const { patientId, therapistId } = input;

  const result = await db
    .insert(relationships)
    .values({
      patientId,
      therapistId,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  const relationship = result.at(0);
  if (!relationship) {
    throw new Error("Failed to create therapist-patient relationship");
  }

  return {
    relationshipId: relationship.relationshipId,
    status: relationship.status,
    createdAt: relationship.createdAt,
    updatedAt: relationship.updatedAt,
  };
}

export async function changeTherapist(
  input: ChangeTherapistInput,
): Promise<ChangeTherapistResult> {
  const { patientId, currentTherapistId, newTherapistId, shareComments } =
    input;

  let previousTherapistComments: string[] | undefined;
  if (shareComments) {
    const comments = await db
      .select({
        commentId: therapistComments.commentId,
        comment: therapistComments.comment,
        createdAt: therapistComments.createdAt,
      })
      .from(therapistComments)
      .where(
        and(
          eq(therapistComments.patientId, patientId),
          eq(therapistComments.therapistId, currentTherapistId),
        ),
      );

    previousTherapistComments = comments
      .map((c) => c.comment)
      .filter((comment): comment is string => comment !== null);
  }

  await db
    .update(relationships)
    .set({ status: "declined", updatedAt: new Date() })
    .where(
      and(
        eq(relationships.patientId, patientId),
        eq(relationships.therapistId, currentTherapistId),
      ),
    );

  const newRelationshipResult = await db
    .insert(relationships)
    .values({
      patientId,
      therapistId: newTherapistId,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  const newRelationship = newRelationshipResult.at(0);
  if (!newRelationship) {
    throw new Error("Failed to create new therapist-patient relationship");
  }

  return {
    relationshipId: newRelationship.relationshipId,
    previousTherapistComments,
  };
}

export async function listPatientsByTherapist({
  therapistId,
  limit = 5,
  offset = 0,
}: {
  therapistId: number;
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
    .where(eq(relationships.therapistId, therapistId))
    .limit(limit)
    .offset(offset);
}

export async function updatePreferences({
  patientId,
  values,
}: {
  patientId: number;
  values: {
    agePreference: (typeof ageEnum.enumValues)[number] | null;
    genderPreference: (typeof genderEnum.enumValues)[number] | null;
    specialtyPreference: (typeof specialtyEnum.enumValues)[number] | null;
  };
}) {
  const [result] = await db
    .update(patients)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(patients.patientId, patientId))
    .returning();
  if (!isDefined(result)) {
    throw new Error("Error updating patient: " + patientId);
  }
  return result;
}

export async function getCurrentTherapist(
  input: GetPatientTherapistInput,
): Promise<GetPatientTherapistResult> {
  const { patientId } = input;
  const result = await db
    .select({
      therapistId: relationships.therapistId,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(relationships)
    .innerJoin(users, eq(users.userId, relationships.therapistId))
    .where(
      and(
        eq(relationships.patientId, patientId),
        eq(relationships.status, "approved"),
      ),
    );
  return result[0];
}

interface TherapistWithStatus {
  id: number;
  firstName: string;
  lastName: string;
  age: number | null;
  gender: "male" | "female" | "other" | null;
  specialty: (typeof specialtyEnum.enumValues)[number] | null;
  status: "current" | "accepting" | "not accepting" | "pending";
}

export async function listTherapistsForPatient({
  patientId,
}: {
  patientId: number;
}): Promise<TherapistWithStatus[]> {
  const result = [];
  const list = await db
    .select()
    .from(therapists)
    .innerJoin(users, eq(users.userId, therapists.therapistId));

  for (const { therapist, user } of list) {
    const map: TherapistWithStatus = {
      id: therapist.therapistId,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
      specialty: therapist.specialty,
      status: therapist.accepting ? "accepting" : "not accepting",
    };
    const [relationship] = await db
      .select()
      .from(relationships)
      .where(
        and(
          eq(relationships.patientId, patientId),
          eq(relationships.therapistId, therapist.therapistId),
        ),
      );
    if (relationship?.status === "approved") {
      map.status = "current";
    } else if (relationship?.status === "pending") {
      map.status = "pending";
    }
    result.push(map);
  }
  return result;
}

export async function requestTherapist({
  therapistId,
  patientId,
}: {
  therapistId: number;
  patientId: number;
}) {
  const oldRequests = await db
    .delete(relationships)
    .where(eq(relationships.patientId, patientId))
    .returning();
  if (!isDefined(oldRequests)) {
    throw new Error("Error deleting relationships");
  }
  const request = await db
    .insert(relationships)
    .values({
      patientId,
      therapistId,
      status: "pending",
    })
    .returning();
  if (!isDefined(request)) {
    throw new Error("Error creating relationship");
  }
}

export async function dropTherapist({
  therapistId,
  patientId,
}: {
  therapistId: number;
  patientId: number;
}) {
  const oldTherapist = await db
    .delete(relationships)
    .where(
      and(
        eq(relationships.patientId, patientId),
        eq(relationships.therapistId, therapistId),
      ),
    )
    .returning();
  if (!isDefined(oldTherapist)) {
    throw new Error("Error deleting relationship");
  }
}
