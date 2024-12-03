import { InboxContent } from "./inbox-content";
import { listMessages } from "~/data-access/message";
import { currentUser } from "@clerk/nextjs/server";
import { formatName } from "~/lib/utils";
import { listTherapistByPatient } from "~/data-access/therapist";
import { listPatientsByTherapist } from "~/data-access/patient";

export default async function InboxPage() {
  const user = await currentUser();
  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  const role = user?.unsafeMetadata.role as "therapist" | "patient";
  const messages = (
    await listMessages({
      userId,
    })
  ).map(({ message, sender, recipient }) => ({
    id: message.messageId,
    sender: {
      id: sender.id,
      name: formatName(sender),
    },
    recipient: {
      id: recipient.id,
      name: formatName(recipient),
    },
    read: message.isRead,
    date: message.sentAt,
    text: message.message,
  }));
  const users =
    role === "therapist"
      ? (await listPatientsByTherapist({ therapistId: userId })).map(
          (result) => ({
            id: result.patient.id,
            name: formatName(result.patient),
          }),
        )
      : (await listTherapistByPatient({ patientId: userId })).map((result) => ({
          id: result.therapist.id,
          name: formatName(result.therapist),
        }));
  return <InboxContent messages={messages} users={users} role={role} />;
}
