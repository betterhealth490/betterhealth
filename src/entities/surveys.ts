export interface GetSurveyInput {
  surveyId: number;
}

export interface GetSurveyResult {
  surveyId: number;
  patientId: number;
  createdAt: Date;
  waterIntake: number;
  sleepLength: number;
  stressLevel: number;
  foodIntake: number;
  sleepTime: number;
  foodHealthQuality: number;
  mood: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
  sleepQuality: number;
  selfImage: number;
}

export interface ListSurveyInput {
  date: Date;
  userId: number;
}

export interface ListSurveyItem {
  createdAt: Date;
  waterIntake: number;
  sleepLength: number;
  stressLevel: number;
  foodIntake: number;
  sleepTime: number;
  foodHealthQuality: number;
  mood: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
  sleepQuality: number;
  selfImage: number;
} 

export type ListSurveyResult = ListSurveyItem[];

export interface UpdateSurveyInput {
  surveyId: number;
  patientId: number;
  createdAt: Date;
  waterIntake: number;
  sleepLength: number;
  stressLevel: number;
  foodIntake: number;
  sleepTime: number;
  foodHealthQuality: number;
  mood: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
  sleepQuality: number;
  selfImage: number;
}

export interface UpdateSurveyResult {
  waterIntake: number;
  sleepLength: number;
  stressLevel: number;
  foodIntake: number;
  sleepTime: number;
  foodHealthQuality: number;
  mood: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
  sleepQuality: number;
  selfImage: number;
}

export interface CreateSurveyInput {
  patientId: number;
  createdAt: Date;
  waterIntake: number;
  sleepLength: number;
  stressLevel: number;
  foodIntake: number;
  sleepTime: number;
  foodHealthQuality: number;
  mood: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
  sleepQuality: number;
  selfImage: number;
}

export interface CreateSurveyResult {
  patientId: number;
  createdAt: Date;
  waterIntake: number;
  sleepLength: number;
  stressLevel: number;
  foodIntake: number;
  sleepTime: number;
  foodHealthQuality: number;
  mood: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
  sleepQuality: number;
  selfImage: number;
}