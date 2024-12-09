import { eq, and, sql } from "drizzle-orm";
import { db } from "~/db";
import { users, billing, initialPatientQuestionnare, journals, therapistPatient } from "~/db/schema";

export interface SelectTherapistInput {
  patientId: number;
  therapistId: number;
}

export interface SelectTherapistResult {
  relationshipId: number;
  status: "Pending" | "Approved" | "Declined" | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ChangeTherapistInput {
  patientId: number;
  currentTherapistId: number;
  newTherapistId: number;
  shareComments: boolean;
  redoInitialSurvey: boolean;
}

export interface ChangeTherapistResult {
  relationshipId: number;
  previousTherapistComments?: string[];
  initialSurveyData?: object;
}

export interface TherapistComment {
  commentId: number;
  comment: string | null;
  createdAt: Date;
}

export interface InitialSurveyData {
  surveyId: number;
  surveyData: object;
  createdAt: Date;
}

export interface ListPatientInput {
  therapistId: number;
}

export interface ListPatientItem {
  patientId: number;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ListPatientResult = ListPatientItem[];

export interface ListTherapistPatientsInput {
  therapistId: number;
}

export interface ListTherapistPatientsItem {
  patientId: number;
  firstName: string;
  lastName: string;
  status: "Pending" | "Approved" | "Declined" | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export type ListTherapistPatientsResult = ListTherapistPatientsItem[];

export interface DeleteUserInput {
  userId: number;
}

export interface DeleteUserResult {
  success: boolean;
  message: string;
}

export async function areAllBillsPaid(userId: number): Promise<boolean> {
  const result = await db
    .select({ status: billing.status })
    .from(billing)
    .where(eq(billing.patientId, userId));

  return result.every((bill) => bill.status === "Paid");
}

export async function isUserTherapist(userId: number): Promise<boolean> {
  const result = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.userId, userId))
    .limit(1);

  const user = result.at(0);
  return user?.role === "therapist";
}

export async function deleteUserRelatedData(userId: number): Promise<void> {
  await db.delete(initialPatientQuestionnare).where(eq(initialPatientQuestionnare.patientId, userId));
  await db.delete(journals).where(eq(journals.patientId, userId));
  await db.delete(therapistPatient).where(eq(therapistPatient.patientId, userId));
  await db.delete(billing).where(eq(billing.patientId, userId));
}

export async function deleteUser(userId: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.userId, userId));
    
    return result.rowCount !== null && result.rowCount > 0;
}
