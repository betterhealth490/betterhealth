"use server";

import { revalidatePath } from "next/cache";
import { createJournal, updateJournal } from "~/data-access/journal";
import { isDefined } from "~/lib/utils";

export const createJournalAction = async (
  patientId: number,
  title: string,
  text: string,
) => {
  const result = await createJournal({ patientId, title, content: text });
  console.log("success", isDefined(result));
  revalidatePath("/journal");
};

export const updateJournalAction = async (
  journalId: number,
  title: string,
  text: string,
) => {
  const result = await updateJournal({ journalId, title, content: text });
  console.log("success", isDefined(result));
  revalidatePath("/journal");
};
