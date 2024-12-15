import { eq, and } from "drizzle-orm";
import { db } from "~/db";
import { billings, users, relationships } from "~/db/schema";

import { 
  type GetBillingInput, type GetBillingResult, 
  type CreateBillingInput, type CreateBillingResult, 
  type UpdateBillingInput, type UpdateBillingResult, 
  type ListBillingInput, type ListBillingResult 
} from "~/entities/billing";

export async function createBilling(input: CreateBillingInput): Promise<CreateBillingResult> {
  const result = await db
    .insert(billings)
    .values({
      patientId: input.patientId,
      amount: input.amount.toFixed(2), 
      dueDate: input.dueDate,
      status: input.status ?? "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ billId: billings.billId });

  const billingRecord = result.at(0);

  if (!billingRecord) {
    throw new Error("Failed to create billing record");
  }

  return { billId: billingRecord.billId };
}

export async function getBilling(input: GetBillingInput): Promise<GetBillingResult> {
  const result = await db
    .select()
    .from(billings)
    .where(
      and(
        eq(billings.billId, input.billId),
        eq(billings.patientId, input.patientId)
      )
    )
    .limit(1);

  const billingRecord = result.at(0);

  if (!billingRecord) {
    throw new Error("Billing record not found");
  }

  return {
    billId: billingRecord.billId,
    patientId: billingRecord.patientId,
    amount: parseFloat(billingRecord.amount),
    dueDate: billingRecord.dueDate,
    status: billingRecord.status ?? "pending",
    createdAt: billingRecord.createdAt,
    updatedAt: billingRecord.updatedAt ?? null,
  };
}

export async function updateBilling(input: UpdateBillingInput): Promise<UpdateBillingResult> {
  const result = await db
    .update(billings)
    .set({
      amount: input.amount.toFixed(2),
      status: input.status,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(billings.billId, input.billId),
        eq(billings.patientId, input.patientId)
      )
    )
    .returning();

  const updatedBilling = result.at(0);

  if (!updatedBilling) {
    throw new Error("Failed to update billing record");
  }

  return {
    billId: updatedBilling.billId,
    patientId: updatedBilling.patientId,
    amount: parseFloat(updatedBilling.amount),
    status: updatedBilling.status ?? "pending",
    dueDate: updatedBilling.dueDate,
    createdAt: updatedBilling.createdAt,
    updatedAt: updatedBilling.updatedAt ?? null,
  };
}

export async function listBillings(input: ListBillingInput): Promise<ListBillingResult> {
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
    billId: billingRecord.billId,
    patientId: billingRecord.patientId,
    amount: parseFloat(billingRecord.amount),
    dueDate: billingRecord.dueDate,
    status: billingRecord.status ?? "pending",
    updatedAt: billingRecord.updatedAt ?? new Date(),
  }));
}

export async function getTherapistNameByBillId(billId: number): Promise<string | null> {
  const result = await db
    .select({
      therapistFirstName: users.firstName,
      therapistLastName: users.lastName,
    })
    .from(billings)
    .innerJoin(users, eq(billings.therapistId, users.userId))
    .where(eq(billings.billId, billId))
    .limit(1);

  const therapist = result.at(0);

  if (!therapist) {
    return null; 
  }

  return `${therapist.therapistFirstName} ${therapist.therapistLastName}`;
}

export async function listPatientsByTherapist(therapistId: number): Promise<
  {
    patientId: number;
    firstName: string;
    lastName: string;
  }[]
> {
  const result = await db
    .select({
      patientId: relationships.patientId,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(relationships)
    .innerJoin(users, eq(relationships.patientId, users.userId))
    .where(and(eq(relationships.therapistId, therapistId), eq(relationships.status, "approved")));

  return result;
}

export async function listBillsByTherapist(therapistId: number): Promise<
  {
    billId: number;
    patientId: number;
    firstName: string;
    lastName: string;
    amount: number;
    dueDate: Date;
    status: "pending" | "paid";
    createdAt: Date;
  }[]
> {
  const result = await db
    .select({
      billId: billings.billId,
      patientId: billings.patientId,
      firstName: users.firstName,
      lastName: users.lastName,
      amount: billings.amount, 
      dueDate: billings.dueDate,
      status: billings.status,
      createdAt: billings.createdAt,
    })
    .from(billings)
    .innerJoin(users, eq(billings.patientId, users.userId))
    .where(eq(billings.therapistId, therapistId));

  return result.map((bill) => ({
    billId: bill.billId,
    patientId: bill.patientId,
    firstName: bill.firstName,
    lastName: bill.lastName,
    amount: parseFloat(bill.amount), 
    dueDate: bill.dueDate,
    status: bill.status ?? "pending", 
    createdAt: bill.createdAt,
  }));
}

export async function createBillForPatient({
  therapistId,
  patientId,
  amount,
  dueDate,
}: {
  therapistId: number;
  patientId: number;
  amount: number;
  dueDate: Date;
}): Promise<{ billId: number }> {
  const result = await db
    .insert(billings)
    .values({
      therapistId,
      patientId,
      amount: amount.toFixed(2), 
      dueDate,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      billId: billings.billId,
    });

  const bill = result.at(0);

  if (!bill) {
    throw new Error("Failed to create bill");
  }

  return { billId: bill.billId };
}
