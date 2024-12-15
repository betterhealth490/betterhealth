import { notFound } from "next/navigation";
import { JournalContent } from "./journal-content";
import { currentUser } from "@clerk/nextjs/server";
import { listJournals } from "~/data-access/journal";

export default async function InboxPage() {
  const user = await currentUser();
  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  const role = user?.unsafeMetadata.role as "therapist" | "member";
  if (role === "therapist") {
    notFound();
  }
  const entries = await listJournals(userId);
  return <JournalContent entries={entries} role={role} />;
}
