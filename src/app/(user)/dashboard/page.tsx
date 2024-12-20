import { PageWrapper } from "../page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { currentUser } from "@clerk/nextjs/server";
import { listSurveys, listSurveysByTherapist } from "~/data-access/surveys";
import { isDefined } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { DailySurveyButton } from "./survey-form";
import { TherapistSurveys } from "./(therapist)/surveys/content";
import { PatientSurveys } from "./(patient)/surveys/content";
import { PatientOverview } from "./(patient)/overview/content";
import { TherapistOverview } from "./(therapist)/overview/content";
import { listAppointmentsWithDetails } from "~/data-access/appointment";
import {
  getCurrentTherapist,
  listTherapistsForPatient,
} from "~/data-access/patient";
import {
  listBillsByPatient,
  listBillsByTherapist,
  listPatientsByTherapist,
} from "~/data-access/billing";
import { getTherapist } from "~/data-access/therapist";
import { PatientTherapistList } from "./(patient)/therapists/content";
import { TherapistPatientList } from "./(therapist)/patients/content";

export const dynamic = "force-dynamic";

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
  const currentTherapist = await getCurrentTherapist({ patientId: userId });
  const appointments = (await listAppointmentsWithDetails({ userId })).map(
    (appointment) => ({
      id: appointment.appointmentId,
      date: appointment.appointmentDate,
      patient: {
        ...appointment.patient,
        id: appointment.patient.userId,
      },
      therapist: {
        ...appointment.therapist,
        id: appointment.therapist.userId,
      },
      status: appointment.status,
    }),
  );
  const bills = await listBillsByPatient({ patientId: userId });
  const therapists = await listTherapistsForPatient({ patientId: userId });
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
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="therapists">Therapists</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <PatientOverview
            therapist={
              currentTherapist
                ? { ...currentTherapist, id: currentTherapist?.therapistId }
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
        <TabsContent value="therapists">
          <PatientTherapistList therapists={therapists} />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}

async function TherapistDashboard({ userId }: { userId: number }) {
  const surveys = await listSurveysByTherapist({ therapistId: userId });
  const { accepting: status } = await getTherapist(userId);
  const appointments = (await listAppointmentsWithDetails({ userId })).map(
    (appointment) => ({
      id: appointment.appointmentId,
      date: appointment.appointmentDate,
      patient: {
        ...appointment.patient,
        id: appointment.patient.userId,
      },
      therapist: {
        ...appointment.therapist,
        id: appointment.therapist.userId,
      },
      status: appointment.status,
    }),
  );
  const bills = await listBillsByTherapist(userId);
  const patients = await listPatientsByTherapist(userId);
  return (
    <PageWrapper>
      <Tabs defaultValue="overview" className="p-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <TherapistOverview
            userId={userId}
            status={status}
            appointments={appointments}
            bills={bills}
            patients={patients}
          />
        </TabsContent>
        <TabsContent value="surveys">
          <TherapistSurveys surveys={surveys} />
        </TabsContent>
        <TabsContent value="patients">
          <TherapistPatientList patients={patients} />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
