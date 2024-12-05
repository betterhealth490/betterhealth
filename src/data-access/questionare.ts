import { asc, eq } from "drizzle-orm";
import { db } from "~/db";
import { questionare } from "~/db/schema";

export async function getQuestionare({ surveyId }: { surveyId: number }) {
  const [survey] = await db
    .select()
    .from(questionare)
    .where(eq(questionare.surveyId, surveyId));
  return survey;
}

export async function listQuestionares({
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
      surveyId: questionare.surveyId,
    })
    .from(questionare)
    .where(eq(questionare.userId, userId))
    .orderBy(asc(questionare.surveyId))
    .limit(limit)
    .offset(offset);
}

export async function createQuestionare({
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
    .insert(questionare)
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

export async function updateQuestionare({
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
    .update(questionare)
    .set({
      surveyDate: date,
      surveyType: type,
      surveyData: data,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(questionare.surveyId, surveyId))
    .returning();
  return survey;
}
