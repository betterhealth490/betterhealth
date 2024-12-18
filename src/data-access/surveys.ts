import { eq, asc, desc, and } from "drizzle-orm";
import { db } from "~/db";
import { relationships, surveys, users } from "~/db/schema";
import { isDefined } from "~/lib/utils";

export async function listSurveys({ patientId }: { patientId: number }) {
  return await db
    .select({
      id: surveys.surveyId,
      date: surveys.createdAt,
      sleepTime: surveys.sleepTime,
      sleepLength: surveys.sleepLength,
      sleepQuality: surveys.sleepQuality,
      waterIntake: surveys.waterIntake,
      foodIntake: surveys.foodIntake,
      foodHealthQuality: surveys.foodHealthQuality,
      stressLevel: surveys.stressLevel,
      selfImage: surveys.selfImage,
    })
    .from(surveys)
    .where(eq(surveys.patientId, patientId))
    .orderBy(desc(surveys.createdAt));
}

export async function listSurveysByTherapist({
  therapistId,
}: {
  therapistId: number;
}) {
  return await db
    .select({
      id: surveys.surveyId,
      patient: {
        id: relationships.patientId,
        firstName: users.firstName,
        lastName: users.lastName,
      },
      date: surveys.createdAt,
      sleepTime: surveys.sleepTime,
      sleepLength: surveys.sleepLength,
      sleepQuality: surveys.sleepQuality,
      waterIntake: surveys.waterIntake,
      foodIntake: surveys.foodIntake,
      foodHealthQuality: surveys.foodHealthQuality,
      stressLevel: surveys.stressLevel,
      selfImage: surveys.selfImage,
    })
    .from(relationships)
    .innerJoin(surveys, eq(surveys.patientId, relationships.patientId))
    .innerJoin(users, eq(users.userId, relationships.patientId))
    .where(
      and(
        eq(relationships.therapistId, therapistId),
        eq(relationships.status, "approved"),
      ),
    )
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
