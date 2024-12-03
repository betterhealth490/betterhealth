import { db } from "~/db";
import { messages, users } from "~/db/schema";
import { desc, eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export async function listMessages({
  userId: id,
  limit = 20,
  offset = 0,
}: {
  userId: number;
  limit?: number;
  offset?: number;
}) {
  const senders = alias(users, "sender");
  const recipients = alias(users, "recipient");
  return await db
    .select({
      message: messages,
      sender: {
        id: senders.userId,
        firstName: senders.firstName,
        lastName: senders.lastName,
        email: senders.email,
      },
      recipient: {
        id: recipients.userId,
        firstName: recipients.firstName,
        lastName: recipients.lastName,
        email: recipients.email,
      },
    })
    .from(messages)
    .innerJoin(senders, eq(messages.senderId, senders.userId))
    .innerJoin(recipients, eq(messages.recipientId, recipients.userId))
    .where(or(eq(messages.recipientId, id), eq(messages.senderId, id)))
    .orderBy(desc(messages.sentAt))
    .limit(limit)
    .offset(offset);
}

export async function createMessage({
  senderId,
  recipientId,
  text,
}: {
  senderId: number;
  recipientId: number;
  text: string;
}) {
  const [message] = await db
    .insert(messages)
    .values({
      senderId,
      recipientId,
      message: text,
      sentAt: new Date(),
    })
    .returning();
  return message;
}

export async function updateMessage({
  messageId,
  read,
}: {
  messageId: number;
  read: boolean;
}) {
  const [message] = await db
    .update(messages)
    .set({
      isRead: read,
      updatedAt: new Date(),
    })
    .where(eq(messages.messageId, messageId))
    .returning();
  return message;
}
