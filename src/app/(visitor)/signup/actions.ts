"use server";

import { unauthenticatedAction } from "~/lib/safe-action";
import { createMemberUseCase, createTherapistUseCase } from "~/data-access/user";
import { memberFormSchema, therapistFormSchema } from "./schema";

export const createMemberAction = unauthenticatedAction
  .createServerAction()
  .input(memberFormSchema)
  .handler(async ({ input }) => {
    return await createMemberUseCase(
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
    return await createTherapistUseCase(
      input.firstName,
      input.lastName,
      input.licenseNumber,
      input.email,
      input.password,
    );
  });
