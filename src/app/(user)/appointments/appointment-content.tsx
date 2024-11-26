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
import { Loading } from "~/components/loading";

interface InboxContentProps {
  messages: Message[];
  role: "therapist" | "patient";
  users: InboxUser[];
}

export function AppointmentContent({ therapists }: InboxContentProps) {
  const { user, isLoaded } = useUser();
  const [message, setMessage] = useState<Message | null>(null);
  const [search, setSearch] = useState<string>("");
  if (!isLoaded) {
    return <Loading/>
  }
  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  return (
    <PageWrapper
      actions={
        <div className="flex items-center">
          {users.length > 0 ? (
            <CreateMessageButton userId={userId} role={role} users={users} />
          ) : (
            <Button disabled>
              <PencilLineIcon />
              {role === "therapist"
                ? "No patients added"
                : "No therapists added"}
            </Button>
          )}
        </div>
      }
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="flex flex-col gap-4 p-4" minSize={30}>
          <InboxSearch
            role={role}
            users={users}
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
