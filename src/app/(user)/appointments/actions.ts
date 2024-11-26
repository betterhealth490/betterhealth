'use server'

import { currentUser, User } from "@clerk/nextjs/server";
import { listTherapistByPatient } from "~/data-access/therapist";
import { isDefined } from "~/lib/utils";

export const currentUserAction = async() => {
    const result = await currentUser();
    console.log("success", isDefined(result));
    return result;
}

export const listTherapistsByPatientAction = async(
    patientId: number
) => {
    const result = await listTherapistByPatient({ patientId });
    console.log("success", isDefined(result));
    return result;
}