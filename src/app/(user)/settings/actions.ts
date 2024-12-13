"use server";

import { getPatient } from "~/data-access/patient";

export const getPatientAction = async (
  patientId: number
) => {
  try {
    const result = await getPatient({ patientId });
    return { ok: true, result };
  } catch (err) {
    console.log(JSON.stringify(err));

    return { ok: false, error: JSON.stringify(err) };
  }
};