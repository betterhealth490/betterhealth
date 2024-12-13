import { promises as fs } from "fs"
import { PageWrapper } from "../page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DataTable } from "./components/data-table";
import path from "path";
import { z } from "zod";
import { taskSchema } from "./data/schema";
import { columns } from "./components/columns";
import { currentUser } from "@clerk/nextjs/server";
import { SurveysContent } from "./surveys/content";
import { listSurveys } from "~/data-access/surveys";
import { isDefined } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { DailySurveyButton } from "./survey-form";

async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/app/(user)/dashboard/data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default async function DashboardPage() {
  const user = await currentUser();
  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  const role = user?.unsafeMetadata.role as string;
  return role === "member" ? (
    <PatientDashboard userId={userId} />
  ) : (
    <div>Therapist dashboard</div>
  );
}

async function PatientDashboard({ userId }: { userId: number }) {
  const surveys = (await listSurveys({ patientId: userId })).map((survey) => ({
    id: survey.surveyId,
    date: survey.createdAt,
    ...survey,
  }));
  const dailySurveyCompleted = isDefined(
    surveys.find(
      ({ date }) => date.toDateString() === new Date().toDateString(),
    ),
  );
  const tasks = await getTasks()
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
      <Tabs defaultValue="overview" className="p-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="therapists">Therapists</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview</TabsContent>
        <TabsContent value="surveys">
          <SurveysContent surveys={surveys} />
        </TabsContent>
        <TabsContent value="therapists"><DataTable data={tasks} columns={columns}/></TabsContent>
      </Tabs>
    </PageWrapper>
  );
}