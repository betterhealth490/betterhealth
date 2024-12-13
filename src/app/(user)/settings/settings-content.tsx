import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import ProfileTab from "./profile-tab"
import PreferencesTab from "./preferences-tab"
import AccountTab from "./account-tab"
import IdentityTab from "./identity-tab"
import { getPatientAction } from "./actions"

export async function SettingsContent({ role, userId } : { role: string, userId: number }) {
    const patientInfo = (await getPatientAction(userId));

  return (
    <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {role === "member" ? (
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
            ) : (
                <TabsTrigger value="identity">Identity</TabsTrigger>
            )}
            <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
            <ProfileTab 
            firstName={patientInfo.result?.firstName}
            lastName={patientInfo.result?.lastName}
            email={patientInfo.result?.email}
            password={patientInfo.result?.password}/>
        </TabsContent>
        {role === "member" ? (
            <TabsContent value="preferences">
                <PreferencesTab/>
            </TabsContent>
        ) : (
            <TabsContent value="identity">
                <IdentityTab/>
            </TabsContent>
        )}
        <TabsContent value="account">
            <AccountTab/>
        </TabsContent>
    </Tabs>
  )
}