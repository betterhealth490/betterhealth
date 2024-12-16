import { PageWrapper } from "../page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { currentUser } from "@clerk/nextjs/server";
import { PatientSurveys } from "./(patient)/surveys/content";
import { listSurveys, listSurveysByTherapist } from "~/data-access/surveys";
import { isDefined } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { DailySurveyButton } from "./survey-form";
import { TherapistSurveys } from "./(therapist)/surveys/content";
import { OverviewContent } from "./overview/content";
import { listAppointments } from "~/data-access/appointment";
import { getPatientTherapist } from "~/data-access/patient";
import { listBillsByPatient } from "~/data-access/billing";

export default async function DashboardPage() {
  const user = await currentUser();
  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  const role = user?.unsafeMetadata.role as string;
  return role === "member" ? (
    <PatientDashboard userId={userId} />
  ) : (
    <TherapistDashboard userId={userId} />
  );
}

async function PatientDashboard({ userId }: { userId: number }) {
  const surveys = await listSurveys({ patientId: userId });
  const dailySurveyCompleted = isDefined(
    surveys.find(
      ({ date }) => date.toDateString() === new Date().toDateString(),
    ),
  );
  const therapist = await getPatientTherapist({ patientId: userId });
  const appointments = (await listAppointments({ userId })).map(
    (appointment) => ({
      id: appointment.appointmentId,
      date: appointment.appointmentDate,
      status: appointment.status,
    }),
  );
  const bills = (await listBillsByPatient({ patientId: userId })).map(
    (bill) => ({
      id: bill.id,
      dueDate: bill.dueDate,
      amount: bill.amount,
      status: bill.status,
    }),
  );
  return (
    <PageWrapper
      actions={
        !dailySurveyCompleted ? (
          <DailySurveyButton userId={userId} />
        ) : (
          <Button disabled>Daily survey completed</Button>
        )
      }
    >
      <Tabs defaultValue="overview" className="w-full p-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="therapists">Therapists</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewContent
            therapist={
              therapist
                ? { ...therapist, id: therapist?.therapistId }
                : undefined
            }
            appointments={appointments}
            bills={bills}
            surveys={surveys}
          />
        </TabsContent>
        <TabsContent value="surveys">
          <PatientSurveys surveys={surveys} />
        </TabsContent>
        <TabsContent value="therapists">Therapists</TabsContent>
      </Tabs>
    </PageWrapper>
  );
}

async function TherapistDashboard({ userId }: { userId: number }) {
  const surveys = await listSurveysByTherapist({ therapistId: userId });
  const dailySurveyCompleted = isDefined(
    surveys.find(
      ({ date }) => date.toDateString() === new Date().toDateString(),
    ),
  );
  return (
    <PageWrapper>
      <Tabs defaultValue="overview" className="p-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="therapists">Patients</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview</TabsContent>
        <TabsContent value="surveys">
          <TherapistSurveys surveys={surveys} />
        </TabsContent>
        <TabsContent value="therapists">Patients</TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
