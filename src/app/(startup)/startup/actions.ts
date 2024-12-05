"use server";

import { createSurvey } from "~/data-access/questionare";

export const createInitialSurveyAction = async (
  userId: number,
  data: { answers: string[][] },
) => {
  return await createSurvey({
    userId,
    type: "initial",
    date: new Date(),
    data,
  });
};
