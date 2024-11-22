"use client";

import { ComponentProps, useState } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { cn } from "~/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { ChatBox } from "~/app/(user)/inbox/chat-box";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface InboxItem {
  profileImageUrl: string;
  firstName: string;
  lastName: string;
  latestMessage: {
    text: string;
    time: Date;
  };
  unreadMessages: number;
  id: number;
}

interface ItemListProps {
  items: InboxItem[];
}

export function ItemList({ items }: ItemListProps) {
  const [inboxItem, setInboxItem] = useState<InboxItem>();
  const clerk = useClerk();

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const {replace} = useRouter()

  const handleSearch = (searchTerm: string) => {
      const params = new URLSearchParams(searchParams)

      if (searchTerm) {params.set("id", searchTerm)}
      else {params.delete("id")}

      replace (`${pathname}?${params.toString()}`)
  }


  return (
    <div className="flex flex-col gap-2 p-4 pt-0 w-4/12">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <SearchIcon
              color="gray"
              size="16"
              className="absolute left-2 top-3 h-4 w-4 text-muted-foreground"
            />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
      <ScrollArea className="h-screen">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-center gap-2 rounded-lg mt-2 border p-3 text-left text-sm w-full transition-all hover:bg-accent",
              inboxItem?.id === item.id && "bg-muted",
            )}
            onClick={() => {
              setInboxItem(item); 
              item.unreadMessages = 0;
              handleSearch(item.id.toString())
            }}
          >
            <Avatar>
              <AvatarImage src={item.profileImageUrl} />
              <AvatarFallback>
                {item.firstName.charAt(0) + item.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex w-full flex-col gap-2">
              <div className="flex w-full justify-between">
                <div className="font-semibold capitalize">
                  {item.firstName + " " + item.lastName}
                </div>
                <div>
                  {item.unreadMessages}
                </div>
              </div>
              <div className="flex w-full justify-between text-xs text-muted-foreground">
                <div>
                  {item.latestMessage.text.substring(0, 300)}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    inboxItem?.id === item.id
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {formatDistanceToNow(new Date(item.latestMessage.time), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          </button>
        ))}
      </ScrollArea>
    </div>
  );
}
