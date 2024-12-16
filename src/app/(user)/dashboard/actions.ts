"use server";

import { revalidatePath } from "next/cache";
import { createSurvey } from "~/data-access/surveys";
import { changeStatus } from "~/data-access/therapist";

export const createSurveyAction = async (
  patientId: number,
  values: {
    waterIntake: number;
    sleepLength: number;
    stressLevel: number;
    foodIntake: number;
    sleepTime: number;
    foodHealthQuality: number;
    sleepQuality: number;
    selfImage: number;
  },
) => {
  try {
    const result = await createSurvey({ patientId, values });
    revalidatePath("/dashboard");
    return { ok: true, result };
  } catch (err) {
    console.log(JSON.stringify(err));

    return { ok: false, error: JSON.stringify(err) };
  }
};

export const changeStatusAction = async (
  therapistId: number,
  accepting: boolean,
) => {
  try {
    const result = await changeStatus({ therapistId, accepting });
    return { ok: true, result };
  } catch (err) {
    console.log("err", JSON.stringify(err));
    return { ok: false, error: JSON.stringify(err) };
  }
};
