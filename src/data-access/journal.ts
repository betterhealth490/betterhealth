import { eq, and, desc } from "drizzle-orm";
import { db } from "~/db";
import { journals } from "~/db/schema";

import { type GetJournalInput, type GetJournalResult } from "~/entities/journal";
import { type GetJournalUpdateInput, type GetJournalUpdateResult } from "~/entities/journal";
import { type ListJournalInput, type ListJournalResult } from "~/entities/journal";

// Create Journal
export async function createJournal(input: {
  patientId: number;
  title: string;
  entryDate: Date;
  content: string;
}): Promise<number> {
  const result = await db
    .insert(journals)
    .values({
      patientId: input.patientId,
      title: input.title,
      entryDate: input.entryDate,
      content: input.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      journalId: journals.journalId,
    });

  const journal = result.at(0);

  if (!journal) {
    throw new Error("Failed to create journal");
  }

  return journal.journalId;
}

// Get Journal
export async function getJournal(input: GetJournalInput): Promise<GetJournalResult> {
  const result = await db
    .select()
    .from(journals)
    .where(
      and(
        eq(journals.journalId, input.journalId),
        eq(journals.patientId, input.patientId) 
      )
    );

  const journal = result.at(0);

  if (journal) {
    return {
      journalId: journal.journalId,
      title: journal.title,
      entryDate: journal.entryDate,
      content: journal.content ?? "",
      patientId: journal.patientId,
      createdAt: journal.createdAt,
      updatedAt: journal.updatedAt,
    };
  } else {
    throw new Error("No journal found");
  }
}

// Update Journal
export async function updateJournal(
  input: GetJournalUpdateInput & { content: string }
): Promise<GetJournalUpdateResult> {
  const result = await db
    .update(journals)
    .set({
      content: input.content,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(journals.journalId, input.journalId),
        eq(journals.patientId, input.patientId) 
      )
    )
    .returning();

  const updatedJournal = result.at(0);

  if (updatedJournal) {
    return {
      journalId: updatedJournal.journalId,
      title: updatedJournal.title,
      entryDate: updatedJournal.entryDate,
      content: updatedJournal.content ?? "",
      patientId: updatedJournal.patientId,
      createdAt: updatedJournal.createdAt,
      updatedAt: updatedJournal.updatedAt,
    };
  } else {
    throw new Error("Failed to update journal");
  }
}

export async function listJournals(patientId: number): Promise<ListJournalResult> {
  const result = await db
    .select({
      journalId: journals.journalId,
      patientId: journals.patientId,
      title: journals.title,
      entryDate: journals.entryDate,
      content: journals.content ?? "",
      updatedAt: journals.updatedAt,
    })
    .from(journals)
    .where(eq(journals.patientId, patientId)) 
    .orderBy(desc(journals.entryDate)); 

  return result.map((journal) => ({
    journalId: journal.journalId,
    patientId: journal.patientId,
    title: journal.title,
    entryDate: journal.entryDate,
    content: journal.content ?? "",
    updatedAt: journal.updatedAt ?? new Date(),
  }));
}

