import { Boilerplate } from "~/components/boilerplate";
import { PageWrapper } from "../page-wrapper";
import { Separator } from "~/components/ui/separator";
import { SettingsContent } from "./settings-content";
import { currentUser } from "@clerk/nextjs/server";

// export interface UserProps{
//     userId: number
//     age: number
//     role: string
//     firstName: string
//     lastName: string
//     email: string
//     password: string
//     agePreference: string
//     genderPreference: string
//     specialtyPreference: string
//     gender: string
//     specialty: string
// }

export default async function SettingsPage() {
    const user = await currentUser();
    const role = user?.unsafeMetadata.role as string;
    const userId = parseInt(user?.unsafeMetadata.databaseId as string);

    return (
        <PageWrapper>
            <div className="space-y-6 p-4">
                <SettingsContent role={role} userId={userId}/>
            </div>
        </PageWrapper>
    )
}
