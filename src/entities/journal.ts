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
  entryDate: Date;
  content: string;
  patientId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetJournalUpdateInput {
  journalId: number;
  title: string;
  content: string;
}

export interface GetJournalUpdateResult {
  journalId: number;
  patientId: number;
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
  id: number;
  title: string;
  date: Date;
  text: string;
}

export type ListJournalResult = ListJournalItem[];
