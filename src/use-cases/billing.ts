import { eq, and } from "drizzle-orm";
import { db } from "~/db";
import { billing} from "~/db/schema";

import { type GetBillingInput, type GetBillingResult } from "~/entities/billing";
import { type CreateBillingInput, type CreateBillingResult } from "~/entities/billing";
import { type UpdateBillingInput, type UpdateBillingResult } from "~/entities/billing";

// Create billing
export async function createBilling(input: CreateBillingInput): Promise<CreateBillingResult> {
    const result = await db
        .insert(billing)
        .values({
            userId: input.userId,
            amount: input.amount.toString(),
            dueDate: input.dueDate,
            status: input.status ?? "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .returning({
            billId: billing.billId,
        });

    const billingRecord = result.at(0);

    if (!billingRecord) {
        throw new Error("Failed to create billing record");
    }

    return { billId: billingRecord.billId };
}

// Get billing by ID
export async function getBilling(input: GetBillingInput): Promise<GetBillingResult> {
    const result = await db
        .select()
        .from(billing)
        .where(
            and(
                eq(billing.billId, input.billId),
                eq(billing.userId, input.userId)
            )
        )
        .limit(1);

    const billingRecord = result.at(0);

    if (!billingRecord) {
        throw new Error("Billing record not found");
    }

    return {
        ...billingRecord,
        amount: parseFloat(billingRecord.amount as string), 
        status: billingRecord.status ?? "pending",
    };
}

// Function to mark a bill as paid
export async function markBillAsPaid(input: UpdateBillingInput): Promise<void> {
    await db.transaction(async (trx) => {
        const result = await trx
            .update(billing)
            .set({
                status: "paid",
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(billing.billId, input.billId),
                    eq(billing.userId, input.userId),
                    eq(billing.status, "pending")
                )
            )
            .returning();

        const updatedBilling = result.at(0);

        if (!updatedBilling) {
            throw new Error("Failed to update the billing status to paid.");
        }
    });
}

export async function updateBilling(input: UpdateBillingInput): Promise<UpdateBillingResult> {
    const currentBilling = await db
        .select()
        .from(billing)
        .where(
            and(
                eq(billing.billId, input.billId),
                eq(billing.userId, input.userId)
            )
        )
        .limit(1);

    const existingBilling = currentBilling.at(0);

    if (!existingBilling) {
        throw new Error("Billing record not found");
    }

    const newAmount = existingBilling.amount + input.amount;

    const result = await db
        .update(billing)
        .set({
            amount: newAmount,
            status: input.status,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(billing.billId, input.billId),
                eq(billing.userId, input.userId)
            )
        )
        .returning();

    const updatedBilling = result.at(0);

    if (updatedBilling) {
        return {
            ...updatedBilling,
            amount: parseFloat(updatedBilling.amount as string),
            status: updatedBilling.status ?? "pending", 
        };
    } else {
        throw new Error("Failed to update billing record");
    }
}