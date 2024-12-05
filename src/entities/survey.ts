export interface GetSurveyInput {
  habitId: number;
}

export interface GetSurveyResult {
  habitId: number;
  patientId: number;
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
}

export interface ListSurveyInput {
  date: Date;
  userId: number;
}

export interface ListSurveyItem {
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
  feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
} 

export type ListSurveyResult = ListSurveyItem[];

export interface UpdateSurveyInput {
  habitId: number;
  patientId: number;
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
}

export interface UpdateSurveyResult {
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
  feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
}

export interface CreateSurveyInput {
  patientId: number;
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
  feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
}

export interface CreateSurveyResult {
  patientId: number;
  date: Date;
  waterIntake: number;
  sleepHours: number;
  mealsEaten: number;
  feeling: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
}
