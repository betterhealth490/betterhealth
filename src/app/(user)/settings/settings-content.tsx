import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import ProfileTab from "./profile-tab"
import PreferencesTab from "./preferences-tab"
import AccountTab from "./account-tab"
import IdentityTab from "./identity-tab"
import { getPatientAction, getTherapistAction } from "./actions"
import { ageEnum, genderEnum, specialtyEnum } from "~/db/schema"


export async function SettingsContent({ role, userId } : { role: string, userId: number }) {
    const patientInfo = (await getPatientAction(userId));
    const therapistInfo = (await getTherapistAction(userId))

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
        {role === "member" ? (
            <TabsContent value="profile">
                <ProfileTab
                userId={userId} 
                firstName={patientInfo.result?.firstName}
                lastName={patientInfo.result?.lastName}
                email={patientInfo.result?.email}
                password={patientInfo.result?.password}/>
            </TabsContent>
        ) : (
            <TabsContent value="profile">
                <ProfileTab
                userId={userId} 
                firstName={therapistInfo.result?.firstName}
                lastName={therapistInfo.result?.lastName}
                email={therapistInfo.result?.email}
                password={therapistInfo.result?.password}/>
            </TabsContent>
        )}
        {role === "member" ? (
            <TabsContent value="preferences">
                <PreferencesTab
                patientId={userId}
                agePreference={patientInfo.result?.agePreference ?? null}
                genderPreference={patientInfo.result?.genderPreference ?? null}
                specialtyPreference={patientInfo.result?.specialtyPreference ?? null}/>
            </TabsContent>
        ) : (
            <TabsContent value="identity">
                <IdentityTab
                gender={therapistInfo.result?.gender ?? undefined}
                specialty={therapistInfo.result?.gender ?? undefined}/>
            </TabsContent>
        )}
        <TabsContent value="account">
            {role === "member" ? (
                <AccountTab 
                password={patientInfo.result?.password}
                userId={userId}/>
            ) : (
                <AccountTab 
                password={therapistInfo.result?.password}
                userId={userId}/>
            )}
        </TabsContent>
    </Tabs>
  )
}