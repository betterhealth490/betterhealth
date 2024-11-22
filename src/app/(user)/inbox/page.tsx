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
    firstName: "Joe",
    lastName: "Biden",
    email: "JoeBiden1@gmail.com",
    messages: ["I love children more than I love people.", "I love children more than I love people.", "I love children more than I love people.", "I love children more than I love people."],
    latestMessage: {
      text: "I love children more than I love people.",
      time: new Date(),
    },
    unreadMessages: 9,
    id: 1,
  },
  {
    profileImageUrl: "/demo.png",
    firstName: "Joe",
    lastName: "Biden",
    email: "JoeBiden2@gmail.com",
    messages: ["I love children more than I love people.", "I love children more than I love people.", "I love children more than I love people.", "I love children more than I love people."],
    latestMessage: {
      text: "I love children more than I love people.",
      time: new Date(),
    },
    unreadMessages: 9,
    id: 2,
  },
  {
    profileImageUrl: "/demo.png",
    firstName: "Joe",
    lastName: "Biden",
    email: "JoeBiden3@gmail.com",
    messages: ["I love children more than I love people.", "I love children more than I love people.", "I love children more than I love people.", "I love children more than I love people."],
    latestMessage: {
      text: "I love children more than I love people.",
      time: new Date(),
    },
    unreadMessages: 9,
    id: 3,
  },
];

export default function InboxPage() {
  return (
    <div>
      <div className="flex">
        <ItemList items={mockInbox}/>
        <ChatBox item={mockInbox[0]}/>
      </div>
    </div>
  );
}
