"use server";

import { revalidatePath } from "next/cache";
import {
  getPatient,
  getTherapist,
  updatePreferences,
} from "~/data-access/patient";
import {
  changeTherapistStatus,
  updateSpecialty,
} from "~/data-access/therapist";
import { checkMember, deleteMember, updateProfile } from "~/data-access/user";
import { type ageEnum, type genderEnum, type specialtyEnum } from "~/db/schema";

export const getPatientAction = async (patientId: number) => {
  try {
    const result = await getPatient({ patientId });
    return { ok: true, result };
  } catch (err) {
    console.log(JSON.stringify(err));

    return { ok: false, error: JSON.stringify(err) };
  }
};

export const deleteMemberAction = async (userId: number) => {
  try {
    const check = await checkMember(userId);
    if (check.includes({ status: "pending" })) {
      return {
        ok: false,
        error: "User has pending bills preventing account deletion.",
      };
    } else {
      const result = await deleteMember(userId);
      return { ok: true, result };
    }
  } catch (err) {
    console.log(JSON.stringify(err));

    return { ok: false, error: JSON.stringify(err) };
  }
};

export const deactivateTherapistAction = async (userId: number) => {
  try {
    const result = await changeTherapistStatus({
      therapistId: userId,
      active: false,
    });
    revalidatePath("/settings");
    return { ok: true, result };
  } catch (err) {
    console.log(JSON.stringify(err));
    return { ok: false, error: JSON.stringify(err) };
  }
};

export const reactivateTherapistAction = async (userId: number) => {
  try {
    await changeTherapistStatus({
      therapistId: userId,
      active: true,
    });
    revalidatePath("/settings");
    return { ok: true };
  } catch (err) {
    console.log(JSON.stringify(err));
    return { ok: false, error: JSON.stringify(err) };
  }
};

export const getTherapistAction = async (therapistId: number) => {
  try {
    const result = await getTherapist({ therapistId });
    return { ok: true, result };
  } catch (err) {
    console.log(JSON.stringify(err));

    return { ok: false, error: JSON.stringify(err) };
  }
};

export const updatePreferencesAction = async (
  patientId: number,
  values: {
    agePreference: (typeof ageEnum.enumValues)[number] | null;
    genderPreference: (typeof genderEnum.enumValues)[number] | null;
    specialtyPreference: (typeof specialtyEnum.enumValues)[number] | null;
  },
) => {
  try {
    const result = await updatePreferences({ patientId, values });
    revalidatePath("/settings");
    return { ok: true, result };
  } catch (err) {
    console.log(JSON.stringify(err));

    return { ok: false, error: JSON.stringify(err) };
  }
};

export const updateProfileAction = async (
  userId: number,
  options: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
  },
) => {
  try {
    const result = await updateProfile({ userId, options });
    revalidatePath("/settings");
    return { ok: true, result };
  } catch (err) {
    console.log(JSON.stringify(err));

    return { ok: false, error: JSON.stringify(err) };
  }
};

export const updateIdentityAction = async (
  userId: number,
  options: {
    age?: number | undefined;
    gender?: (typeof genderEnum.enumValues)[number] | undefined;
    specialty?: (typeof specialtyEnum.enumValues)[number] | undefined;
  },
) => {
  try {
    const result1 = await updateSpecialty({
      therapistId: userId,
      specialty: options.specialty,
    });
    const result2 = await updateProfile({ userId, options });
    revalidatePath("/settings");
    return { ok: true, result: [result1, result2] };
  } catch (err) {
    console.log(JSON.stringify(err));
    return { ok: false, error: JSON.stringify(err) };
  }
};
