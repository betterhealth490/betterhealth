"use server";

import { revalidatePath } from "next/cache";
import { dropTherapist, requestTherapist } from "~/data-access/patient";
import { createSurvey } from "~/data-access/surveys";
import {
  acceptPatient,
  changeStatus,
  declinePatient,
} from "~/data-access/therapist";

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
    revalidatePath("/dashboard");
    return { ok: true, result };
  } catch (err) {
    console.log("err", JSON.stringify(err));
    return { ok: false, error: JSON.stringify(err) };
  }
};

export const requestTherapistAction = async (
  therapistId: number,
  patientId: number,
) => {
  try {
    const result = await requestTherapist({ therapistId, patientId });
    revalidatePath("/dashboard");
    return { ok: true, result };
  } catch (err) {
    console.log("err", JSON.stringify(err));
    return { ok: false, error: JSON.stringify(err) };
  }
};

export const dropTherapistAction = async (
  therapistId: number,
  patientId: number,
) => {
  try {
    const result = await dropTherapist({ therapistId, patientId });
    revalidatePath("/dashboard");
    return { ok: true, result };
  } catch (err) {
    console.log("err", JSON.stringify(err));
    return { ok: false, error: JSON.stringify(err) };
  }
};

export const acceptPatientAction = async (
  therapistId: number,
  patientId: number,
) => {
  try {
    const result = await acceptPatient({ therapistId, patientId });
    revalidatePath("/dashboard");
    return { ok: true, result };
  } catch (err) {
    console.log("err", JSON.stringify(err));
    return { ok: false, error: JSON.stringify(err) };
  }
};

export const declinePatientAction = async (
  therapistId: number,
  patientId: number,
) => {
  try {
    const result = await declinePatient({ therapistId, patientId });
    revalidatePath("/dashboard");
    return { ok: true, result };
  } catch (err) {
    console.log("err", JSON.stringify(err));
    return { ok: false, error: JSON.stringify(err) };
  }
};
