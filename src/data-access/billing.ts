import { eq, and } from "drizzle-orm";
import { db } from "~/db";
import { billings } from "~/db/schema";

import {
  type GetBillingInput,
  type GetBillingResult,
} from "~/entities/billing";
import {
  type CreateBillingInput,
  type CreateBillingResult,
} from "~/entities/billing";
import {
  type UpdateBillingInput,
  type UpdateBillingResult,
} from "~/entities/billing";
import {
  type ListBillingInput,
  type ListBillingResult,
} from "~/entities/billing";

// Create billing
export async function createBilling(
  input: CreateBillingInput,
): Promise<CreateBillingResult> {
  const result = await db
    .insert(billings)
    .values({
      patientId: input.patientId,
      amount: input.amount.toString(),
      dueDate: input.dueDate,
      status: input.status ?? "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      billId: billings.billId,
    });

  const billingRecord = result.at(0);

  if (!billingRecord) {
    throw new Error("Failed to create billing record");
  }

  return { billId: billingRecord.billId };
}

// Get billing by ID
export async function getBilling(
  input: GetBillingInput,
): Promise<GetBillingResult> {
  const result = await db
    .select()
    .from(billings)
    .where(
      and(
        eq(billings.billId, input.billId),
        eq(billings.patientId, input.patientId),
      ),
    )
    .limit(1);

  const billingRecord = result.at(0);

  if (!billingRecord) {
    throw new Error("Billing record not found");
  }

  return {
    ...billingRecord,
    amount: parseFloat(billingRecord.amount),
    status: billingRecord.status ?? "pending",
  };
}

// Update billing record
export async function updateBilling(
  input: UpdateBillingInput,
): Promise<UpdateBillingResult> {
  const result = await db
    .update(billings)
    .set({
      amount: input.amount.toString(),
      status: input.status,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(billings.billId, input.billId),
        eq(billings.patientId, input.patientId),
      ),
    )
    .returning();

  const updatedBilling = result.at(0);
  if (updatedBilling) {
    return {
      ...updatedBilling,
      amount: parseFloat(updatedBilling.amount),
      status: updatedBilling.status ?? "pending", // Fallback to default status
    };
  } else {
    throw new Error("Failed to update billing record");
  }
}

// List all billing records for a user
export async function listBillings(
  input: ListBillingInput,
): Promise<ListBillingResult> {
  const result = await db
    .select({
      billId: billings.billId,
      patientId: billings.patientId,
      amount: billings.amount,
      dueDate: billings.dueDate,
      status: billings.status,
      updatedAt: billings.updatedAt,
    })
    .from(billings)
    .where(eq(billings.patientId, input.patientId));

  return result.map((billingRecord) => ({
    ...billingRecord,
    amount: parseFloat(billingRecord.amount),
    updatedAt: billingRecord.updatedAt ?? new Date(),
  }));
}
