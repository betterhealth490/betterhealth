import { PageWrapper } from "../page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DashboardSurveys } from "./surveys";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();
  const role = user?.unsafeMetadata.role as string;
  return role === "member" ? (
    <PatientDashboard />
  ) : (
    <div>Therapist dashboard</div>
  );
}

function PatientDashboard() {
  return (
    <PageWrapper>
      <Tabs defaultValue="overview" className="p-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="therapists">Therapists</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview</TabsContent>
        <TabsContent value="surveys">
          <DashboardSurveys />
        </TabsContent>
        <TabsContent value="therapists">Therapists</TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
