import { z } from "zod";
import { db } from "~/db";
import { patients, therapists, users } from "~/db/schema";
import {
  EmailInUseError,
  LicenseInUseError,
  SignUpError,
} from "~/entities/errors";
import { isDefined } from "~/lib/utils";

export async function createMember(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  try {
    const [user] = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "member",
      })
      .returning();
    if (!isDefined(user)) {
      throw new SignUpError();
    }
    const [patient] = await db
      .insert(patients)
      .values({ patientId: user.userId })
      .returning();
    if (!isDefined(patient)) {
      throw new SignUpError();
    }
    return { user, patient };
  } catch (e) {
    const { success, data } = z.object({ constraint: z.string() }).safeParse(e);
    if (success && data.constraint === "betterhealth_user_email_unique") {
      throw new EmailInUseError();
    }
    throw new SignUpError();
  }
}

export async function createTherapist(
  firstName: string,
  lastName: string,
  licenseNumber: string,
  email: string,
  password: string,
) {
  try {
    const [user] = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "therapist",
      })
      .returning();
    if (!isDefined(user)) {
      throw new SignUpError();
    }
    console.log(user);
    const [therapist] = await db
      .insert(therapists)
      .values({ therapistId: user.userId })
      .returning();
    if (!isDefined(therapist)) {
      throw new SignUpError();
    }
    return { user, therapist };
  } catch (e) {
    const { success, data } = z.object({ constraint: z.string() }).safeParse(e);
    if (success && data.constraint === "betterhealth_user_email_unique") {
      throw new EmailInUseError();
    }
    if (
      success &&
      data.constraint === "betterhealth_user_license_number_unique"
    ) {
      throw new LicenseInUseError();
    }
    throw new SignUpError();
  }
}
