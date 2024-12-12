import { promises as fs } from "fs"
import { PageWrapper } from "../page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DataTable } from "./components/data-table";
import path from "path";
import { z } from "zod";
import { taskSchema } from "./data/schema";
import { columns } from "./components/columns";

async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/app/(user)/dashboard/data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default async function DashboardPage() {
  const tasks = await getTasks()

  return (
    <PageWrapper>
      <Tabs className="p-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="therapists">Therapists</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview</TabsContent>
        <TabsContent value="tracking">Tracking</TabsContent>
        <TabsContent value="therapists"><DataTable data={tasks} columns={columns}/></TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
