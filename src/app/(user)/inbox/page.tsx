import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { array, z } from "zod";
import { Form } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { TabsContent } from "~/components/ui/tabs";
import { ItemList } from "~/components/user/item-list";
import dynamic from "next/dynamic";
import styles from "./chat-box.module.css";
import { ChatBox } from "./chat-box";

// const Chat = dynamic(() => import("~/app/(user)/inbox/chat"), {
//   ssr: false,
// });

const mockInbox = [
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

export default function InboxPage({searchParams}: {searchParams?: {id?: string}}) {
  const id = searchParams?.id || '0'

  return (
    <div>
      <div className="flex">
        <ItemList items={mockInbox}/>
        <ChatBox item={mockInbox[parseInt(id)]}/>
      </div>
    </div>
  );
}
