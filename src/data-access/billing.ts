import { eq, and } from "drizzle-orm";
import { db } from "~/db";
import { billing} from "~/db/schema";

import { type GetBillingInput, type GetBillingResult } from "~/entities/billing";
import { type CreateBillingInput, type CreateBillingResult } from "~/entities/billing";
import { type UpdateBillingInput, type UpdateBillingResult } from "~/entities/billing";
import { type ListBillingInput, type ListBillingResult } from "~/entities/billing";

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


// Update billing record
export async function updateBilling(input: UpdateBillingInput): Promise<UpdateBillingResult> {
    const result = await db
        .update(billing)
        .set({
            amount: input.amount.toString(),
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
            status: updatedBilling.status ?? "pending", // Fallback to default status
        };
    } else {
        throw new Error("Failed to update billing record");
    }
}

// List all billing records for a user
export async function listBillings(input: ListBillingInput): Promise<ListBillingResult> {
    const result = await db
        .select({
            billId: billing.billId,
            userId: billing.userId,
            amount: billing.amount,
            dueDate: billing.dueDate,
            status: billing.status,
            updatedAt: billing.updatedAt,
        })
        .from(billing)
        .where(eq(billing.userId, input.userId));

    return result.map((billingRecord) => ({
        ...billingRecord,
        amount: parseFloat(billingRecord.amount as string), 
        updatedAt: billingRecord.updatedAt ?? new Date(),
    }));
}
