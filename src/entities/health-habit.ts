export interface GetHealthHabitsInput {
  habitId: number;
}

export interface GetHealthHabitsResult {
  habitId: number;
  patientId: number;
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
}

export interface ListHealthHabitsInput {
  date: Date;
  userId: number;
}

export interface ListHealthHabitsItem {
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
  feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
} 

export type ListHealthHabitsResult = ListHealthHabitsItem[];

export interface UpdateHealthHabitsInput {
  habitId: number;
  patientId: number;
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
}

export interface UpdateHealthHabitsResult {
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
  feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
}

export interface CreateHealthHabitsInput {
  patientId: number;
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
  feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
}

export interface CreateHealthHabitsResult {
  patientId: number;
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
  feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
}
