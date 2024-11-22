export interface CreateBillingInput {
    userId: number;
    amount: number;
    dueDate: Date;
    status?: "pending" | "paid";
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
    status: "pending" | "paid" | null;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface UpdateBillingInput {
    billId: number;
    userId: number;
    amount: number;
    status: "pending" | "paid"  | null;
}

export interface UpdateBillingResult {
    billId: number;
    userId: number;
    amount: number;
    status: "pending" | "paid"  | null;
    createdAt: Date;
    updatedAt: Date| null;
    dueDate: Date;
}
