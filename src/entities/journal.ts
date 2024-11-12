export interface GetJournalInput {
    userId: string;
    date: Date;
}

export interface GetJournalResult {
    journalId: number;
    entryDate: Date;
    content: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetJournalUpdateInput {
    journalId: number;
    userId: number;
}

export interface GetJournalUpdateResult {
    journalId: number;
    userId: number;
    entryDate: Date;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetJournalListsInput {
    journalId: number;
    userId: number;
}

export interface GetJournalListsResult {
    journalId: number;
    userId: number;
    entryDate: Date;
    updatedAt: Date;
}

