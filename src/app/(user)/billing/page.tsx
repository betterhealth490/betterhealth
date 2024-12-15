"use server";

import { currentUser } from "@clerk/nextjs/server";
import PatientBilling from "./PatientBilling";
import TherapistBilling from "./TherapistBilling";
import { PageWrapper } from "../page-wrapper";

export default async function BillingPage() {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  const role = user?.unsafeMetadata.role as string;

  return (
    <PageWrapper>
      {role === "member" ? (
        <PatientBilling patientId={userId} />
      ) : (
        <TherapistBilling therapistId={userId} />
      )}
    </PageWrapper>
  );
}
