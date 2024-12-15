export interface CreateJournalInput {
    patientId: number;
    entryDate: Date;
    content: string;
}

export interface CreateJournalResult {
    journalId: number;
}

export interface GetJournalInput {
    journalId: number;
    patientId: number;
}

export interface GetJournalResult {
    journalId: number;
    title: string,
    entryDate: Date;
    content: string;
    patientId: number;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface GetJournalUpdateInput {
    journalId: number;
    patientId: number;
}

export interface GetJournalUpdateResult {
    journalId: number;
    patientId: number;
    title: string,
    entryDate: Date;
    content: string;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface ListJournalInput {
    journalId: number;
    patientId: number;
}

export interface ListJournalItem {
    journalId: number;
    patientId: number;
    title: string,
    entryDate: Date;
    content: string;
    updatedAt: Date;
}

export type ListJournalResult = ListJournalItem[];

