'use client'

import { ItemList } from "~/components/user/item-list";
import { ChatBox } from "./chat-box";
import { useState } from "react";
import { isDefined } from "~/lib/utils";

export const mockInbox = [
  {
    profileImageUrl: "/demo.png",
    firstName: "Alex",
    lastName: "Jones",
    email: "AlexJones@gmail.com",
    messages: ["Hey! I'm reaching out to let you know that I have plenty of available dates for appointments.", "Feel free to reach out to me with any problems you're having."],
    latestMessage: {
      text: "Feel free to reach out to me with any problems you're having.",
      time: new Date(),
    },
    unreadMessages: 2,
    id: 0,
  },
  {
    profileImageUrl: "/demo.png",
    firstName: "Eric",
    lastName: "Xavier",
    email: "EricXavier@gmail.com",
    messages: ["Hey! I'm reaching out to let you know that I have plenty of available dates for appointments.", "Feel free to reach out to me with any problems you're having."],
    latestMessage: {
      text: "Feel free to reach out to me with any problems you're having.",
      time: new Date(),
    },
    unreadMessages: 2,
    id: 1,
  },
  {
    profileImageUrl: "/demo.png",
    firstName: "Johnny",
    lastName: "Jones",
    email: "JohnnyJones@gmail.com",
    messages: ["Hey! I'm reaching out to let you know that I have plenty of available dates for appointments.", "Feel free to reach out to me with any problems you're having."],
    latestMessage: {
      text: "Feel free to reach out to me with any problems you're having.",
      time: new Date(),
    },
    unreadMessages: 2,
    id: 2,
  },
];

export interface InboxItem {
  profileImageUrl: string;
  firstName: string;
  lastName: string;
  latestMessage: {
    text: string;
    time: Date;
  };
  email: string;
  messages: string[];
  unreadMessages: number;
  id: number;
}

export default function InboxPage() {
  const [inboxItem, setInboxItem] = useState<InboxItem>();

  return (
    <div>
      <div className="flex">
        <ItemList items={mockInbox} currentItem={inboxItem} onItemClick={setInboxItem}/>
        { isDefined(inboxItem) && <ChatBox item={inboxItem}/> }
      </div>
    </div>
  );
}
