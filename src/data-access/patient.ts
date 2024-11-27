import {
    areAllBillsPaid,
    isUserTherapist,
    deleteUserRelatedData,
    deleteUser,
    DeleteUserInput,
    DeleteUserResult,
    InitialSurveyData,
    ListTherapistPatientsInput,
    ListTherapistPatientsResult,
  } from "~/entities/patient";

import { db } from "~/db";
import { eq, and } from "drizzle-orm";
import { users, therapistPatient, therapistComments, surveys } from "~/db/schema";
import { SelectTherapistInput, SelectTherapistResult, ChangeTherapistInput, ChangeTherapistResult } from "~/entities/patient";

export async function listTherapistPatients(
  input: ListTherapistPatientsInput,
): Promise<ListTherapistPatientsResult> {
  const result = await db
    .select({
      patientId: therapistPatient.patientId,
      firstName: users.firstName,
      lastName: users.lastName,
      status: therapistPatient.status,
      createdAt: therapistPatient.createdAt,
      updatedAt: therapistPatient.updatedAt,
    })
    .from(therapistPatient)
    .innerJoin(users, eq(users.userId, therapistPatient.patientId))
    .where(eq(therapistPatient.therapistId, input.therapistId));

  return result;
}

  
export async function deleteUserall(input: DeleteUserInput): Promise<DeleteUserResult> {
  const { userId } = input;

  const therapist = await isUserTherapist(userId);
  if (therapist) {
    return {
      success: false,
      message: "Cannot delete the user because they are a therapist.",
    };
  }

  const allBillsPaid = await areAllBillsPaid(userId);
  if (!allBillsPaid) {
    return {
      success: false,
      message: "Cannot delete the user because not all bills have been paid.",
    };
  }

  await deleteUserRelatedData(userId);

  const userDeleted = await deleteUser(userId);
  if (!userDeleted) {
    return {
      success: false,
      message: "Failed to delete the user.",
    };
  }

  return {
    success: true,
    message: "User and all related data deleted successfully.",
  };
}

export async function selectTherapist(input: SelectTherapistInput): Promise<SelectTherapistResult> {
  const { patientId, therapistId } = input;

  const result = await db
    .insert(therapistPatient)
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

export async function changeTherapist(input: ChangeTherapistInput): Promise<ChangeTherapistResult> {
  const { patientId, currentTherapistId, newTherapistId, shareComments, redoInitialSurvey } = input;

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
                  eq(therapistComments.therapistId, currentTherapistId)
              )
          );

      previousTherapistComments = comments
          .map((c) => c.comment)
          .filter((comment): comment is string => comment !== null); 
  }

  await db
      .update(therapistPatient)
      .set({ status: "declined", updatedAt: new Date() })
      .where(
          and(
              eq(therapistPatient.patientId, patientId),
              eq(therapistPatient.therapistId, currentTherapistId)
          )
      );

  const newRelationshipResult = await db
      .insert(therapistPatient)
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

  let initialSurveyData: InitialSurveyData | undefined;
  if (redoInitialSurvey) {
      const surveyResult = await db
          .select({
              surveyId: surveys.surveyId,
              surveyData: surveys.surveyData,
              createdAt: surveys.createdAt,
          })
          .from(surveys)
          .where(
              and(
                  eq(surveys.userId, patientId),
                  eq(surveys.surveyType, "initial")
              )
          )
          .limit(1);

      const fetchedSurvey = surveyResult.at(0);
      if (fetchedSurvey) {
          initialSurveyData = {
              surveyId: fetchedSurvey.surveyId,
              surveyData: fetchedSurvey.surveyData as object,
              createdAt: fetchedSurvey.createdAt,
          };
      }
  }

  return {
      relationshipId: newRelationship.relationshipId,
      previousTherapistComments,
      initialSurveyData: redoInitialSurvey ? initialSurveyData?.surveyData : undefined,
  };
}
