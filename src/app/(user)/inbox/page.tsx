import { InboxContent } from "./inbox-content";
import { listMessages } from "~/data-access/message";
import { currentUser } from "@clerk/nextjs/server";
import { formatName } from "~/lib/utils";
import { listTherapistsByMember } from "~/data-access/therapist";

export default async function InboxPage() {
  const user = await currentUser();
  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
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
  const therapists = (await listTherapistsByMember({ memberId: userId })).map(
    (result) => ({
      id: result.therapist.id,
      name: formatName(result.therapist),
    }),
  );
  return <InboxContent messages={messages} therapists={therapists} />;
}
