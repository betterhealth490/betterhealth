import { eq, and } from "drizzle-orm";
import { db } from "~/db";
import {
  billings,
  users,
  relationships,
  type ageEnum,
  type genderEnum,
  type specialtyEnum,
  patients,
} from "~/db/schema";

import {
  type GetBillingInput,
  type GetBillingResult,
  type CreateBillingInput,
  type CreateBillingResult,
  type UpdateBillingInput,
  type UpdateBillingResult,
  type ListBillingInput,
  type ListBillingResult,
} from "~/entities/billing";
import { isDefined } from "~/lib/utils";

export async function createBilling(
  input: CreateBillingInput,
): Promise<CreateBillingResult> {
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
    billId: billingRecord.billId,
    patientId: billingRecord.patientId,
    amount: parseFloat(billingRecord.amount),
    dueDate: billingRecord.dueDate,
    status: billingRecord.status ?? "pending",
    createdAt: billingRecord.createdAt,
    updatedAt: billingRecord.updatedAt ?? null,
  };
}

export async function updateBilling(
  input: UpdateBillingInput,
): Promise<UpdateBillingResult> {
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
        eq(billings.patientId, input.patientId),
      ),
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

export async function listBillsByPatient(
  input: ListBillingInput,
): Promise<ListBillingResult> {
  return (
    await db
      .select({
        id: billings.billId,
        patientId: billings.patientId,
        therapist: {
          id: billings.therapistId,
          firstName: users.firstName,
          lastName: users.lastName,
        },
        amount: billings.amount,
        dueDate: billings.dueDate,
        status: billings.status,
      })
      .from(billings)
      .innerJoin(users, eq(users.userId, billings.therapistId))
      .where(eq(billings.patientId, input.patientId))
  ).map((result) => ({ ...result, amount: parseFloat(result.amount) }));
}

export async function getTherapistNameByBillId(
  billId: number,
): Promise<string | null> {
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

export async function listPatientsByTherapist(
  therapistId: number,
  status?: "current" | "pending",
): Promise<
  {
    id: number;
    firstName: string;
    lastName: string;
    agePreference: (typeof ageEnum.enumValues)[number] | null;
    genderPreference: (typeof genderEnum.enumValues)[number] | null;
    specialtyPreference: (typeof specialtyEnum.enumValues)[number] | null;
    status: "current" | "pending";
  }[]
> {
  const whereStatus = isDefined(status)
    ? status === "current"
      ? eq(relationships.status, "approved")
      : eq(relationships.status, "pending")
    : undefined;
  const result = await db
    .select({
      id: relationships.patientId,
      firstName: users.firstName,
      lastName: users.lastName,
      status: relationships.status,
      agePreference: patients.agePreference,
      genderPreference: patients.genderPreference,
      specialtyPreference: patients.specialtyPreference,
    })
    .from(relationships)
    .innerJoin(users, eq(relationships.patientId, users.userId))
    .innerJoin(patients, eq(relationships.patientId, patients.patientId))
    .where(and(eq(relationships.therapistId, therapistId), whereStatus));

  return result.map((rel) => ({
    ...rel,
    status: rel.status === "approved" ? "current" : "pending",
  }));
}

export async function listBillsByTherapist(therapistId: number): Promise<
  {
    id: number;
    therapistId: number;
    patient: {
      id: number;
      firstName: string;
      lastName: string;
    };
    amount: number;
    dueDate: Date;
    status: "pending" | "paid";
  }[]
> {
  return (
    await db
      .select({
        id: billings.billId,
        therapistId: billings.therapistId,
        patient: {
          id: billings.patientId,
          firstName: users.firstName,
          lastName: users.lastName,
        },
        amount: billings.amount,
        dueDate: billings.dueDate,
        status: billings.status,
      })
      .from(billings)
      .innerJoin(users, eq(billings.patientId, users.userId))
      .where(eq(billings.therapistId, therapistId))
  ).map((result) => ({ ...result, amount: parseFloat(result.amount) }));
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

export async function deleteBillForPatient({
  billId,
}: {
  billId: number;
}): Promise<{
  therapistId: number;
  patientId: number;
  amount: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date | null;
  status: "pending" | "paid";
  billId: number;
}> {
  const result = await db
    .delete(billings)
    .where(eq(billings.billId, billId))
    .returning();

  const bill = result[0];

  if (!bill) {
    throw new Error("Failed to delete bill");
  }

  return bill;
}
