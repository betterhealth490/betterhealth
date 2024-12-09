export interface CreateBillingInput {
    patientId: number;
    amount: number;
    dueDate: Date;
    status?: "Pending" | "Paid";
}

export interface CreateBillingResult {
    billId: number;
}

export interface GetBillingInput {
    billId: number;
    patientId: number;
}

export interface GetBillingResult {
    billId: number;
    patientId: number;
    amount: number;
    dueDate: Date;
    status: "Pending" | "Paid" | null;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface UpdateBillingInput {
    billId: number;
    patientId: number;
    amount: number;
    status: "Pending" | "Paid"  | null;
}

export interface UpdateBillingResult {
    billId: number;
    patientId: number;
    amount: number;
    status: "Pending" | "Paid"  | null;
    createdAt: Date;
    updatedAt: Date| null;
    dueDate: Date;
}

export interface ListBillingInput {
    patientId: number;
}

export interface ListBillingItem {
    billId: number;
    patientId: number;
    amount: number;
    dueDate: Date;
    status: "Pending" | "Paid"  | null;
    updatedAt: Date;
}

export type ListBillingResult = ListBillingItem[];
