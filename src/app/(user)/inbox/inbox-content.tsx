"use client";

import { Loader } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { InboxList } from "./inbox-list";
import { PageWrapper } from "../page-wrapper";
import { InboxDisplay } from "./inbox-display";
import { type Message } from "./message";
import { useState } from "react";
import { CreateMessageButton } from "./create-message-button";
import { useUser } from "@clerk/nextjs";

interface InboxContentProps {
  messages: Message[];
}

export function InboxContent({ messages }: InboxContentProps) {
  const { user, isLoaded } = useUser();
  const [message, setMessage] = useState<Message | null>(null);
  if (!isLoaded) {
    return <Loader className="animate-spin text-muted-foreground" />;
  }
  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  return (
    <PageWrapper
      actions={
        <div className="flex items-center">
          <CreateMessageButton userId={userId} />
        </div>
      }
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="flex flex-col gap-4 p-4" minSize={30}>
          <Input placeholder="Search" />
          <InboxList
            items={messages}
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
