import { eq, and, sql } from "drizzle-orm";
import { db } from "~/db";
import { survey } from "~/db/schema";
import { 
    type GetSurveyInput,
    type GetSurveyResult,
    type ListSurveyInput,
    type ListSurveyItem,
    type ListSurveyResult,
    type UpdateSurveyInput,
    type UpdateSurveyResult,
    type CreateSurveyInput,
    type CreateSurveyResult
 } from "~/entities/surveys";

export async function getSurvey(input:GetSurveyInput): Promise<GetSurveyResult> {
    const result = await db
        .select()
        .from(survey)
        .where(
            eq(survey.surveyId, input.surveyId)
        );
    
    const habit = result.at(0);
    if(habit){
        return habit;
    }
    else{
        throw new Error("No habits found")
    }       
}

export async function listSurvey(input:ListSurveyInput): Promise<ListSurveyResult> {
    const result = await db
        .select()
        .from(survey)
        .where(
            eq(survey.patientId, input.userId )
        );
    
    const habit = result;
    if(habit){
        return habit;
    }
    else{
        throw new Error("Cannot list health habits");
    }
}

export async function updateSurvey(input: UpdateSurveyInput): Promise<UpdateSurveyResult> {
    const result = db
        .update(survey)
        .set({
            createdAt: input.createdAt,
            waterIntake: input.waterIntake,
            sleepLength: input.sleepLength,
            stressLevel: input.stressLevel,
            foodIntake: input.foodIntake,
            sleepTime: input.sleepTime,
            foodHealthQuality: input.foodHealthQuality,
            sleepQuality: input.sleepQuality,
            selfImage: input.selfImage
        })
        .where(
            and(
                eq(survey.patientId, input.patientId),
                eq(survey.surveyId, input.surveyId)
            )
        )
        .returning();

    const updated = (await result).at(0);
    if(updated){
        return updated
    }
    else{
        throw new Error("Could not updated")
    }

}

export async function createSurvey(input:CreateSurveyInput): Promise<CreateSurveyResult> {
    const result = await db
        .insert(survey)
        .values({
            patientId: input.patientId,
            createdAt: input.createdAt,
            waterIntake: input.waterIntake,
            sleepLength: input.sleepLength,
            stressLevel: input.stressLevel,
            foodIntake: input.foodIntake,
            sleepTime: input.sleepTime,
            foodHealthQuality: input.foodHealthQuality,
            sleepQuality: input.sleepQuality,
            selfImage: input.selfImage
        })
        .returning();

    const created = result.at(0);
    if (created){
        return created;
    }
    else{
        throw new Error("Could not create Health Habit");
    }
}
