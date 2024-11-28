"use client";

import { cn } from "~/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { InboxItem } from "~/entities/inbox";
import { useState } from "react";

interface ItemListProps {
  items: InboxItem[];
  currentItem: InboxItem | undefined;
  onItemClick: (item: InboxItem) => void;
}

function itemIncludes(item: InboxItem, search: string): boolean{
  return item.firstName.toLowerCase().includes(search.toLowerCase()) ||
  item.lastName.toLowerCase().includes(search.toLowerCase()) ||
  item.email.toLowerCase().includes(search.toLowerCase());
}

export function ItemList({ items, currentItem, onItemClick }: ItemListProps) {
  const clerk = useClerk();
  const [search, setSearch] = useState('@');

  return (
    <div className="flex flex-col gap-2 h-[80%]">
      <div className="bg-background/95 backdrop-blur mt-4 mx-4 supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={(e)=>e.preventDefault()}>
          <div className="relative">
            <SearchIcon
              color="gray"
              size="16"
              className="absolute left-2 top-3 h-4 w-4 text-muted-foreground"
            />
            <Input 
              placeholder="Search" 
              className="pl-8"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
      </div>
      <ScrollArea className="h-[60%] w-full">
        {items
          .filter((li) => itemIncludes(li, search))
          .map((item) => (
            <button
              key={item.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border w-[95%] p-2 text-left text-sm mt-2 ml-4 transition-all hover:bg-accent",
                item.id === currentItem?.id && "bg-muted",
              )}
              onClick={() => {
                item.unreadMessages = 0;
                onItemClick(item); 
              }}
            >
            <Avatar>
              <AvatarImage src={item.profileImageUrl} />
              <AvatarFallback>
                {item.firstName.charAt(0) + item.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex w-full flex-col gap-2 h-full">
              <div className="flex w-full justify-between">
                <div className="font-semibold capitalize">
                  {item.firstName + " " + item.lastName}
                </div>
                { item.unreadMessages > 0 && <div className="border rounded-full border-primary bg-primary text-white text-sm w-5 text-center">
                  {item.unreadMessages}
                </div>}
              </div>
              <div className="flex w-full justify-between text-xs text-muted-foreground">
                <div>
                  {item.latestMessage.text.substring(0, 300)}
                </div>
                <div
                  className={cn(
                    "text-xs",
                    item.id === currentItem?.id
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
