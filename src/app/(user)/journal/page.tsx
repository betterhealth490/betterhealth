"use server";

import { currentUser } from "@clerk/nextjs/server";
import JournalsPage from "./journalspage";
import { PageWrapper } from "../page-wrapper";

export default async function JournalPage() {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const id = parseInt(user?.unsafeMetadata.databaseId as string);

  return (
    <PageWrapper>
        <JournalsPage patientId={id} />
    </PageWrapper>
  );
}
