import { eq, and } from "drizzle-orm";
import { db } from "~/db";
import { journals } from "~/db/schema";

import { type GetJournalInput, type GetJournalResult } from "~/entities/journal";
import { type GetJournalUpdateInput, type GetJournalUpdateResult } from "~/entities/journal";
import { type ListJournalInput, type ListJournalResult } from "~/entities/journal";

export async function createJournal(input: { userId: number; entryDate: Date; content: string }): Promise<number> {
    const result = await db
        .insert(journals)
        .values({
            patientId: input.userId,
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

export async function getJournal(input: GetJournalInput): Promise<GetJournalResult> {
    const userId = typeof input.patientId === "string" ? parseInt(input.patientId, 10) : input.patientId;

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
            entryDate: journal.entryDate,
            content: journal.content ?? '', 
            patientId: journal.patientId,
            createdAt: journal.createdAt,
            updatedAt: journal.updatedAt ?? new Date(),
        };
    } else {
        throw new Error("No journal found");
    }
}

export async function updateJournal(
    input: GetJournalUpdateInput & { content: string }): Promise<GetJournalUpdateResult> {
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
            ...updatedJournal,
            content: updatedJournal.content ?? "", 
        };
    } else {
        throw new Error("Failed to update journal");
    }
}

export async function listJournals(userId: number): Promise<ListJournalResult> {
    const result = await db
        .select({
            journalId: journals.journalId,
            patientId: journals.patientId,
            entryDate: journals.entryDate,
            updatedAt: journals.updatedAt,
        })
        .from(journals)
        .where(eq(journals.patientId, userId));

    return result.map((journal) => ({
        ...journal,
        updatedAt: journal.updatedAt ?? new Date(),
    }));
}


