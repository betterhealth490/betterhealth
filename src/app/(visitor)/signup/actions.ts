"use server";

import { unauthenticatedAction } from "~/lib/safe-action";
import { createMember, createTherapist } from "~/data-access/user";
import { memberFormSchema, therapistFormSchema } from "./schema";

export const createMemberAction = unauthenticatedAction
  .createServerAction()
  .input(memberFormSchema)
  .handler(async ({ input }) => {
    return await createMember(
      input.firstName,
      input.lastName,
      input.email,
      input.password,
    );
  });

export const createTherapistAction = unauthenticatedAction
  .createServerAction()
  .input(therapistFormSchema)
  .handler(async ({ input }) => {
    return await createTherapist(
      input.firstName,
      input.lastName,
      input.licenseNumber,
      input.email,
      input.password,
    );
  });
