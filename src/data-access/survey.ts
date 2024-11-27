import { asc, eq } from "drizzle-orm";
import { db } from "~/db";
import { surveys } from "~/db/schema";

export async function getSurvey({ surveyId }: { surveyId: number }) {
  const [survey] = await db
    .select()
    .from(surveys)
    .where(eq(surveys.surveyId, surveyId));
  return survey;
}

export async function listSurveys({
  userId,
  limit = 10,
  offset = 0,
}: {
  userId: number;
  limit?: number;
  offset?: number;
}) {
  return db
    .select({
      surveyId: surveys.surveyId,
    })
    .from(surveys)
    .where(eq(surveys.userId, userId))
    .orderBy(asc(surveys.surveyId))
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
    .insert(surveys)
    .values({
      surveyDate: date,
      surveyType: type,
      surveyData: data,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return survey;
}

export async function updateSurvey({
  surveyId,
  userId,
  date,
  type,
  data,
}: {
  surveyId: number;
  userId: number;
  date: Date;
  type: "initial" | "daily";
  data: Record<string, string | number | object>;
}) {
  const [survey] = await db
    .update(surveys)
    .set({
      surveyDate: date,
      surveyType: type,
      surveyData: data,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(surveys.surveyId, surveyId))
    .returning();
  return survey;
}
