import { eq, and, sql } from "drizzle-orm";
import { db } from "~/db";
import { healthHabits } from "~/db/schema";
import { 
    type GetHealthHabitsInput,
    type GetHealthHabitsResult,
    type ListHealthHabitsInput,
    type ListHealthHabitsItem,
    type ListHealthHabitsResult,
    type UpdateHealthHabitsInput,
    type UpdateHealthHabitsResult,
    type CreateHealthHabitsInput,
    type CreateHealthHabitsResult
 } from "~/entities/health-habit";

export async function getHealthHabit(input:GetHealthHabitsInput): Promise<GetHealthHabitsResult> {
    const result = await db
        .select()
        .from(healthHabits)
        .where(
            eq(healthHabits.habitId, input.habitId)
        );
    
    const habit = result.at(0);
    if(habit){
        return habit;
    }
    else{
        throw new Error("No habits found")
    }       
}

export async function listHealthHabit(input:ListHealthHabitsInput): Promise<ListHealthHabitsResult> {
    const result = await db
        .select()
        .from(healthHabits)
        .where(
            eq(healthHabits.patientId, input.userId )
        );
    
    const habit = result;
    if(habit){
        return habit;
    }
    else{
        throw new Error("Cannot list health habits");
    }
}

export async function updateHealthHabit(input: UpdateHealthHabitsInput): Promise<UpdateHealthHabitsResult> {
    const result = db
        .update(healthHabits)
        .set({
            date: input.date,
            waterIntake: input.waterIntake,
            sleepHours: input.sleepHours,
            mealsEaten: input.mealsEaten
        })
        .where(
            eq(healthHabits.patientId, input.patientId)
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

export async function createHealthHabit(input:CreateHealthHabitsInput): Promise<CreateHealthHabitsResult> {
    const result = await db
        .insert(healthHabits)
        .values({
            date: sql`${input.date}`,
            waterIntake: input.waterIntake,
            sleepHours: input.sleepHours,
            mealsEaten: input.mealsEaten,
            feeling: input.feeling,
            patientId: input.patientId
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
