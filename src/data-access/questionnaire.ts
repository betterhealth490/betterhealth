import { asc, eq } from "drizzle-orm";
import { db } from "~/db";
import { initialPatientQuestionnare } from "~/db/schema";

export async function getSurvey({ questionnaireId }: { questionnaireId: number }) {
  const [survey] = await db
    .select()
    .from(initialPatientQuestionnare)
    .where(eq(initialPatientQuestionnare.questionnaireId, questionnaireId));
  return survey;
}

export async function listSurveys({
  patientId,
  limit = 10,
  offset = 0,
}: {
  patientId: number;
  limit?: number;
  offset?: number;
}) {
  return db
    .select({
      questionnaireId: initialPatientQuestionnare.questionnaireId,
    })
    .from(initialPatientQuestionnare)
    .where(eq(initialPatientQuestionnare.patientId, patientId))
    .orderBy(asc(initialPatientQuestionnare.questionnaireId))
    .limit(limit)
    .offset(offset);
}

export async function createSurvey({
  patientId,
  date,
  type,
  data,
}: {
  patientId: number;
  date: Date;
  type: "initial" | "daily";
  data: Record<string, string | number | object>;
}) {
  const [survey] = await db
    .insert(initialPatientQuestionnare)
    .values({
      questionnaireDate: date,
      questionnaireType: type,
      questionnaireData: data,
      patientId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return survey;
}

export async function updateSurvey({
  questionnaireId,
  patientId,
  date,
  type,
  data,
}: {
  questionnaireId: number;
  patientId: number;
  date: Date;
  type: "initial" | "daily";
  data: Record<string, string | number | object>;
}) {
  const [survey] = await db
    .update(initialPatientQuestionnare)
    .set({
      questionnaireDate: date,
      questionnaireType: type,
      questionnaireData: data,
      patientId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(initialPatientQuestionnare.questionnaireId, questionnaireId))
    .returning();
  return survey;
}
