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
  mood: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
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
  mood: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
} 

export type ListSurveyResult = ListSurveyItem[];

export interface UpdateSurveyInput {
  surveyId: number;
  patientId: number;
  date: Date;
  waterIntake: number;
  sleepLength: number;
  stressLevel: number;
  foodIntake: number;
}

export interface UpdateSurveyResult {
  waterIntake: number;
  sleepLength: number;
  stressLevel: number;
  foodIntake: number;
  mood: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
}

export interface CreateSurveyInput {
  patientId: number;
  createdAt: Date;
  waterIntake: number;
  sleepLength: number;
  stressLevel: number;
  foodIntake: number;
  sleepTime: "Before 8 PM" | "8 PM - 10 PM" | "10 PM - Midnight" | "After Midnight";
  foodHealthQuality: "Low" | "Medium" | "High";
  mood: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
  sleepQuality: "Poor" | "Fair" | "Good" | "Excellent";
  selfImage: "Negative" | "Neutral" | "Positive"
}

export interface CreateSurveyResult {
  patientId: number;
  createdAt: Date;
  waterIntake: number;
  sleepLength: number;
  stressLevel: number;
  foodIntake: number;
  sleepTime: "Before 8 PM" | "8 PM - 10 PM" | "10 PM - Midnight" | "After Midnight";
  foodHealthQuality: "Low" | "Medium" | "High";
  mood: "Excited" | "Happy" | "Okay" | "Mellow" | "Sad" | "I don't know";
  sleepQuality: "Poor" | "Fair" | "Good" | "Excellent";
  selfImage: "Negative" | "Neutral" | "Positive"
}