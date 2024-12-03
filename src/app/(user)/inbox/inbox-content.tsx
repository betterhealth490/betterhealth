"use client";

import { Loader, PencilLineIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { InboxList } from "./inbox-list";
import { PageWrapper } from "../page-wrapper";
import { InboxDisplay } from "./inbox-display";
import { InboxUser, type Message } from "./message";
import { useState } from "react";
import { CreateMessageButton } from "./create-message-button";
import { useUser } from "@clerk/nextjs";
import { InboxSearch } from "./inbox-search";
import { Button } from "~/components/ui/button";
import { containsQuery } from "~/lib/utils";

interface InboxContentProps {
  messages: Message[];
  therapists: InboxUser[];
}

export function InboxContent({ messages, therapists }: InboxContentProps) {
  const { user, isLoaded } = useUser();
  const [message, setMessage] = useState<Message | null>(null);
  const [search, setSearch] = useState<string>("");
  if (!isLoaded) {
    return <Loader className="animate-spin text-muted-foreground" />;
  }
  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  return (
    <PageWrapper
      actions={
        <div className="flex items-center">
          {therapists.length > 0 ? (
            <CreateMessageButton userId={userId} therapists={therapists} />
          ) : (
            <Button disabled>
              <PencilLineIcon />
              No therapists added
            </Button>
          )}
        </div>
      }
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="flex flex-col gap-4 p-4" minSize={30}>
          <InboxSearch
            therapists={therapists}
            value={search}
            setValue={setSearch}
          />
          <InboxList
            items={messages.filter(
              (message) =>
                containsQuery(message.sender.name, search) ||
                containsQuery(message.recipient.name, search),
            )}
            selected={message}
            onSelect={setMessage}
            userId={userId}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30} className="p-4">
          <InboxDisplay item={message} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </PageWrapper>
  );
}
