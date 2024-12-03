"use client";

import { PencilLine } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { InboxList } from "./inbox-list";
import { PageWrapper } from "../page-wrapper";
import { Button } from "~/components/ui/button";
import { InboxDisplay } from "./inbox-detail";
import { type Message } from "./message";
import { useState } from "react";

interface InboxContentProps {
  messages: Message[];
}

export function InboxContent({ messages }: InboxContentProps) {
  const [message, setMessage] = useState<Message | null>(null);
  return (
    <PageWrapper
      actions={
        <div className="flex items-center">
          <Button>
            <PencilLine />
            Start new message
          </Button>
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
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30} className="p-4">
          <InboxDisplay message={message} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </PageWrapper>
  );
}
