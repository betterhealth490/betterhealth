export interface CreateJournalInput {
    userId: number;
    entryDate: Date;
    content: string;
}

export interface CreateJournalResult {
    journalId: number;
}

export interface GetJournalInput {
    journalId: number;
    userId: number;
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
    updatedAt: Date | null;
}

export interface ListJournalInput {
    journalId: number;
    userId: number;
}

export interface ListJournalItem {
    journalId: number;
    userId: number;
    entryDate: Date;
    updatedAt: Date;
    content: string;
}
 
export interface Journal {
    journalId: number;
    entryDate: Date;
    title: string;
    content: string;
  }
  

export type ListJournalResult = ListJournalItem[];

