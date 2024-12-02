import { Journal } from "./journal";

export const mockJournals: Journal[] = [
  {
    journalId: 1,
    entryDate: new Date("2024-11-01"),
    title: "Journal Entry 1",
    content: "This is the first journal entry.",
  },
  {
    journalId: 2,
    entryDate: new Date("2024-11-05"),
    title: "Journal Entry 2",
    content: "This is the second journal entry.",
  },
];
