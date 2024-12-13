import { listSurveys } from "~/data-access/surveys";
import { currentUser } from "@clerk/nextjs/server";
import { SurveysContent } from "./content";

export async function DashboardSurveys() {
  const user = await currentUser();
  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  const surveys = (await listSurveys({ patientId: userId })).map((survey) => ({
    id: survey.surveyId,
    date: survey.createdAt,
    ...survey,
  }));
  return <SurveysContent surveys={surveys} />;
}
