import { z } from "zod";
import { db } from "~/db";
import { users } from "~/db/schema";
import {
  EmailInUseError,
  LicenseInUseError,
  SignUpError,
} from "~/entities/errors";
import { isDefined } from "~/lib/utils";

export async function createMemberUseCase(
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
      })
      .returning();
    if (!isDefined(user)) {
      throw new SignUpError();
    }
    return user;
  } catch (e) {
    const { success, data } = z.object({ constraint: z.string() }).safeParse(e);
    if (success && data.constraint === "betterhealth_user_email_unique") {
      throw new EmailInUseError();
    }
    throw new SignUpError();
  }
}

export async function createTherapistUseCase(
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
        licenseNumber,
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    if (!isDefined(user)) {
      throw new SignUpError();
    }
    return user;
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
