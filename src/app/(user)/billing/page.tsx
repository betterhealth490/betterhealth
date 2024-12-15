import { currentUser } from "@clerk/nextjs/server";
import { PatientBilling } from "./(patient)/content";
import { PageWrapper } from "../page-wrapper";
import {
  listBillsByPatient,
  listBillsByTherapist,
  listPatientsByTherapist,
} from "~/data-access/billing";
import { TherapistBilling } from "./(therapist)/content";
import { CreateBillForm } from "./create-bill-form";
import { Button } from "~/components/ui/button";

export default async function BillingPage() {
  const user = await currentUser();
  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  const role = user?.unsafeMetadata.role as string;

  return role === "member" ? (
    <PatientPage patientId={userId} />
  ) : (
    <TherapistPage therapistId={userId} />
  );
}

async function PatientPage({ patientId }: { patientId: number }) {
  const billings = await listBillsByPatient({ patientId });
  return (
    <PageWrapper>
      <PatientBilling billings={billings} />
    </PageWrapper>
  );
}
async function TherapistPage({ therapistId }: { therapistId: number }) {
  const billings = await listBillsByTherapist(therapistId);
  const patients = await listPatientsByTherapist(therapistId);
  return (
    <PageWrapper
      actions={
        patients.length > 0 ? (
          <CreateBillForm therapistId={therapistId} patients={patients} />
        ) : (
          <Button disabled>No patients</Button>
        )
      }
    >
      <TherapistBilling billings={billings} />
    </PageWrapper>
  );
}
