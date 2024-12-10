import { asc, eq } from "drizzle-orm";
import { db } from "~/db";
import { initialQuestionnare } from "~/db/schema";

export async function getSurvey({ questionnaireId }: { questionnaireId: number }) {
  const [survey] = await db
    .select()
    .from(initialQuestionnare)
    .where(eq(initialQuestionnare.questionnaireId, questionnaireId));
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
      questionnaireId: initialQuestionnare.questionnaireId,
    })
    .from(initialQuestionnare)
    .where(eq(initialQuestionnare.userId, patientId))
    .orderBy(asc(initialQuestionnare.questionnaireId))
    .limit(limit)
    .offset(offset);
}

export async function createSurvey({
  userId,
  date,
  type,
  data,
}: {
  userId: number;
  date: Date;
  type: "initial" | "daily";
  data: Record<string, string | number | object>;
}) {
  const [survey] = await db
    .insert(initialQuestionnare)
    .values({
      questionnaireDate: date,
      questionnaireData: data,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return survey;
}

export async function updateSurvey({
  questionnaireId,
  userId,
  date,
  type,
  data,
}: {
  questionnaireId: number;
  userId: number;
  date: Date;
  type: "initial" | "daily";
  data: Record<string, string | number | object>;
}) {
  const [survey] = await db
    .update(initialQuestionnare)
    .set({
      questionnaireDate: date,
      questionnaireData: data,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(initialQuestionnare.questionnaireId, questionnaireId))
    .returning();
  return survey;
}
