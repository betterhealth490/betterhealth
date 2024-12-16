import { PageWrapper } from "../page-wrapper";
import { PatientSettings, TherapistSettings } from "./settings-content";
import { currentUser } from "@clerk/nextjs/server";

export default async function SettingsPage() {
  const user = await currentUser();
  const role = user?.unsafeMetadata.role as string;
  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  const active = user?.unsafeMetadata.active as boolean;

  return (
    <PageWrapper>
      <div className="space-y-6 p-4">
        {role === "member" ? (
          <PatientSettings userId={userId} />
        ) : (
          <TherapistSettings active={active} userId={userId} />
        )}
      </div>
    </PageWrapper>
  );
}
