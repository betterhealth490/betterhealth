export interface CreateBillingInput {
    userId: number;
    amount: number;
    dueDate: Date;
    status?: "Pending" | "Paid";
}

export interface CreateBillingResult {
    billId: number;
}

export interface GetBillingInput {
    billId: number;
    userId: number;
}

export interface GetBillingResult {
    billId: number;
    userId: number;
    amount: number;
    dueDate: Date;
    status: "Pending" | "Paid" | null;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface UpdateBillingInput {
    billId: number;
    userId: number;
    amount: number;
    status: "Pending" | "Paid"  | null;
}

export interface UpdateBillingResult {
    billId: number;
    userId: number;
    amount: number;
    status: "Pending" | "Paid"  | null;
    createdAt: Date;
    updatedAt: Date| null;
    dueDate: Date;
}

export interface ListBillingInput {
    userId: number;
}

export interface ListBillingItem {
    billId: number;
    userId: number;
    amount: number;
    dueDate: Date;
    status: "Pending" | "Paid"  | null;
    updatedAt: Date;
}

export type ListBillingResult = ListBillingItem[];
