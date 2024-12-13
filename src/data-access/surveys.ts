import { eq, asc } from "drizzle-orm";
import { db } from "~/db";
import { surveys } from "~/db/schema";
import { isDefined } from "~/lib/utils";

export async function listSurveys({ patientId }: { patientId: number }) {
  return await db
    .select()
    .from(surveys)
    .where(eq(surveys.patientId, patientId))
    .orderBy(asc(surveys.createdAt));
}

export async function createSurvey({
  patientId,
  values,
}: {
  patientId: number;
  values: {
    waterIntake: number;
    sleepLength: number;
    stressLevel: number;
    foodIntake: number;
    sleepTime: number;
    foodHealthQuality: number;
    sleepQuality: number;
    selfImage: number;
  };
}) {
  const [result] = await db
    .insert(surveys)
    .values({
      patientId,
      ...values,
    })
    .returning();
  if (!isDefined(result)) {
    throw new Error("Resource creation error: survey");
  }
  return result;
}
