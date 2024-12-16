import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ProfileTab } from "./profile-tab";
import { PreferencesTab } from "./preferences-tab";
import { DeleteTab } from "./delete-tab";
import { IdentityTab } from "./identity-tab";
import { getPatient, getTherapist } from "~/data-access/patient";
import { listPendingBills } from "~/data-access/billing";
import { DeactivateTab } from "./deactivate-tab";

export async function PatientSettings({ userId }: { userId: number }) {
  const patientInfo = await getPatient({ patientId: userId });
  const pendingBills = await listPendingBills({ patientId: userId });

  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileTab
          userId={userId}
          firstName={patientInfo?.firstName}
          lastName={patientInfo?.lastName}
          email={patientInfo?.email}
          password={patientInfo?.password}
        />
      </TabsContent>
      <TabsContent value="preferences">
        <PreferencesTab
          patientId={userId}
          agePreference={patientInfo?.agePreference ?? null}
          genderPreference={patientInfo?.genderPreference ?? null}
          specialtyPreference={patientInfo?.specialtyPreference ?? null}
        />
      </TabsContent>
      <TabsContent value="account">
        <DeleteTab
          pendingBills={pendingBills.length > 0}
          password={patientInfo?.password}
          userId={userId}
        />
      </TabsContent>
    </Tabs>
  );
}

export async function TherapistSettings({
  userId,
  active,
}: {
  userId: number;
  active: boolean;
}) {
  const therapistInfo = await getTherapist({ therapistId: userId });

  return (
    <Tabs defaultValue="profile">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="identity">Identity</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileTab
          userId={userId}
          firstName={therapistInfo?.firstName}
          lastName={therapistInfo?.lastName}
          email={therapistInfo?.email}
          password={therapistInfo?.password}
        />
      </TabsContent>
      <TabsContent value="identity">
        <IdentityTab
          userId={userId}
          age={therapistInfo?.age ?? undefined}
          gender={therapistInfo?.gender ?? undefined}
          specialty={therapistInfo?.specialty ?? undefined}
        />
      </TabsContent>
      <TabsContent value="account">
        <DeactivateTab
          active={active}
          password={therapistInfo?.password}
          userId={userId}
        />
      </TabsContent>
    </Tabs>
  );
}
