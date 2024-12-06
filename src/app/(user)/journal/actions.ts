"use server";

import { createMessage, updateMessage } from "~/data-access/message";
import { isDefined } from "~/lib/utils";

export const createMessageAction = async (
  senderId: number,
  recipientId: number,
  text: string,
) => {
  const result = await createMessage({ senderId, recipientId, text });
  console.log("success", isDefined(result));
};

export const readMessageAction = async (messageId: number) => {
  const result = await updateMessage({ messageId, read: true });
  console.log("success", isDefined(result));
};
