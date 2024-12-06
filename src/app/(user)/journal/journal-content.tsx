"use client";

import { Loader, PencilLineIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { JournalList } from "./journal-list";
import { PageWrapper } from "../page-wrapper";
import { JournalDisplay } from "./journal-display";
import { JournalUser, type JournalEntry } from "./journal-entry";
import { useState } from "react";
import { CreateEntryButton } from "./create-entry-button";
import { useUser } from "@clerk/nextjs";
import { InboxSearch } from "./inbox-search";
import { Button } from "~/components/ui/button";
import { containsQuery } from "~/lib/utils";

interface JournalContentProps {
  entries: JournalEntry[];
  role: "therapist" | "patient";
  users: JournalUser[];
}

export function JournalContent({ entries, role, users }: JournalContentProps) {
  const { user, isLoaded } = useUser();
  const [message, setMessage] = useState<JournalEntry | null>(null);
  const [search, setSearch] = useState<string>("");
  if (!isLoaded) {
    return <Loader className="animate-spin text-muted-foreground" />;
  }
  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  return (
    <PageWrapper
      actions={
        <div className="flex items-center">
          {users.length > 0 ? (
            <CreateEntryButton userId={userId} therapists={users} />
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
          <JournalList
            items={entries.filter((entry) =>
              containsQuery(entry.title, search),
            )}
            selected={message}
            onSelect={setMessage}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30} className="p-4">
          <JournalDisplay entry={message} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </PageWrapper>
  );
}
