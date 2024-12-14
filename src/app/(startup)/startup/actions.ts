"use server";

import { createQuestionnaire } from "~/data-access/questionnaire";

export const createInitialSurveyAction = async (
  userId: number,
  data: { answers: string[][] },
) => {
  return await createQuestionnaire({
    userId,
    type: "initial",
    date: new Date(),
    data,
  });
};
