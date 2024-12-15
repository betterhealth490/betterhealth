"use server";

import { revalidatePath } from "next/cache";
import {
  createBilling,
  getBilling,
  updateBilling,
  listBillsByPatient,
  getTherapistNameByBillId,
  listPatientsByTherapist,
  listBillsByTherapist,
  createBillForPatient,
} from "~/data-access/billing";

import { isDefined } from "~/lib/utils";

export const createBillingAction = async (
  patientId: number,
  amount: number,
  dueDate: Date,
  status?: "pending" | "paid",
) => {
  const result = await createBilling({
    patientId,
    amount,
    dueDate,
    status,
  });
  console.log("Billing record created successfully:", isDefined(result));
  return result;
};

export const getBillingAction = async (billId: number, patientId: number) => {
  const result = await getBilling({ billId, patientId });
  console.log("Billing record fetched successfully:", isDefined(result));
  return result;
};

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
  console.log("Billing record updated successfully:", isDefined(result));
  return result;
};

export const listBillingsAction = async (patientId: number) => {
  const result = await listBillsByPatient({ patientId });
  console.log("Billing records fetched successfully:", isDefined(result));
  return result;
};

export const getTherapistNameByBillIdAction = async (billId: number) => {
  const name = await getTherapistNameByBillId(billId);
  console.log("Therapist name fetched successfully:", name);
  return name;
};

export const listPatientsByTherapistAction = async (therapistId: number) => {
  const patients = await listPatientsByTherapist(therapistId);
  console.log("Patients fetched successfully:", patients);
  return patients;
};

export const listBillsByTherapistAction = async (therapistId: number) => {
  const bills = await listBillsByTherapist(therapistId);
  return bills;
};

export const createBillForPatientAction = async ({
  therapistId,
  patientId,
  amount,
  dueDate,
}: {
  therapistId: number;
  patientId: number;
  amount: number;
  dueDate: Date;
}) => {
  const result = await createBillForPatient({
    therapistId,
    patientId,
    amount,
    dueDate,
  });
  revalidatePath("/billing");
  console.log("Bill created successfully:", result);
  return result;
};
