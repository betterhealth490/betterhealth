export interface GetHealthHabitsInput{
    waterIntake: number,
    sleepHours: number,
    mealsEaten: number
    feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know"
}
export interface GetHealthHabitsResults{
    habitId: number,
    patientId: number,
    date: Date,
    waterIntake: number,
    sleepHours: number,
    mealsEaten: number
}
export interface GetHealthHabitsUpdate{
    habitId: number,
    patientId: number,
    date: Date,
    waterIntake: number,
    sleepHours: number,
    mealsEaten: number
}
export interface GetHealthHabitsList{
    waterIntake: number,
    sleepHours: number,
    mealsEaten: number
    feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know"
}