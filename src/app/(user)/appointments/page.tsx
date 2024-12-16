"use server";

import { currentUser } from "@clerk/nextjs/server";
import PatientAppointments from "./PatientAppointments";
import TherapistAppointments from "./TherapistAppointments";
import { PageWrapper } from "../page-wrapper";

export default async function AppointmentsPage() {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  const role = user?.unsafeMetadata.role as string;

  return (
    <PageWrapper>
      {role === "member" ? (
        <PatientAppointments patientId={userId} />
      ) : (
        <TherapistAppointments therapistId={userId} />
      )}
    </PageWrapper>
  );
}
