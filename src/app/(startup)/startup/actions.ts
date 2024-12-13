"use server";

import { updatePreferences } from "~/data-access/patient";
import { updateTherapistProfile } from "~/data-access/therapist";
import { type ageEnum, type genderEnum, type specialtyEnum } from "~/db/schema";

export const memberQuestionnaireAction = async (
  userId: number,
  values: {
    agePreference: (typeof ageEnum.enumValues)[number] | null;
    genderPreference: (typeof genderEnum.enumValues)[number] | null;
    specialtyPreference: (typeof specialtyEnum.enumValues)[number] | null;
  },
) => {
  try {
    const result = await updatePreferences({
      patientId: userId,
      values,
    });
    return { ok: true, result };
  } catch (err) {
    console.log(err);
    return { ok: false, error: JSON.stringify(err) };
  }
};

export const therapistQuestionnaireAction = async (
  userId: number,
  values: {
    age: number | null;
    gender: (typeof genderEnum.enumValues)[number] | null;
    specialty: (typeof specialtyEnum.enumValues)[number] | undefined;
  },
) => {
  try {
    const result = await updateTherapistProfile({
      therapistId: userId,
      values,
    });
    return { ok: true, result };
  } catch (err) {
    console.log(err);
    return { ok: false, error: JSON.stringify(err) };
  }
};
