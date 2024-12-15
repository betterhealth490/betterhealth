"use server";

import { revalidatePath } from "next/cache";
import { updateBilling } from "~/data-access/billing";
import { isDefined } from "~/lib/utils";

export const updateBillingAction = async (
  billId: number,
  patientId: number,
  amount: number,
  status: "pending" | "paid",
) => {
  const result = await updateBilling({
    billId,
    patientId,
    amount,
    status,
  });
  revalidatePath("/billing");
  console.log("Billing record updated successfully:", isDefined(result));
  return result;
};
