import { currentUser } from "@clerk/nextjs/server";
import { TherapistForm } from "./therapist-form";
import { MemberForm } from "./member-form";

export default async function StartupForm() {
  const user = await currentUser();
  const role = user?.unsafeMetadata.role as "therapist" | "member";

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {role === "therapist" ? <TherapistForm /> : <MemberForm />}
    </div>
  );
}
