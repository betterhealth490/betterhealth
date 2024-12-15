"use server";

import { revalidatePath } from "next/cache";
import { deleteBillForPatient } from "~/data-access/billing";
import { isDefined } from "~/lib/utils";

export const deleteBillingAction = async (billId: number) => {
  const result = await deleteBillForPatient({
    billId,
  });
  revalidatePath("/billing");
  console.log("Billing record deleted successfully:", isDefined(result));
  return result;
};
