"use server";

import { createJournal, updateJournal, listJournals, getJournal } from "~/data-access/journal";
import { isDefined } from "~/lib/utils";

export const createJournalAction = async (
  patientId: number,
  title: string,
  entryDate: Date,
  content: string,
) => {
  const result = await createJournal({ patientId, title, entryDate, content });
  console.log("Journal created successfully:", isDefined(result));
};

export const updateJournalAction = async (
  journalId: number,
  patientId: number,
  content: string,
) => {
  const result = await updateJournal({ journalId, patientId, content });
  console.log("Journal updated successfully:", isDefined(result));
};

export const listJournalsAction = async (patientId: number) => {
  const result = await listJournals(patientId);
  console.log("Journals fetched successfully:", isDefined(result));
  return result;
};

export const getJournalAction = async (journalId: number, patientId: number) => {
  const result = await getJournal({ journalId, patientId });
  console.log("Journal fetched successfully:", isDefined(result));
  return result;
};
