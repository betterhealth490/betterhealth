export interface GetHealthHabitsInput {
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
  feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
}

export interface GetHealthHabitsResults {
  habitId: number;
  patientId: number;
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
}

export interface ListHealthHabitsInput {
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
  feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
}

export interface ListHealthHabitsResult {
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
  feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
}

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
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
  feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
}

export interface CreateHealthHabitsResult {
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
  feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
}
