"use client";

import { Loader } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { JournalList } from "./journal-list";
import { PageWrapper } from "../page-wrapper";
import { JournalDisplay } from "./journal-display";
import { type JournalEntry } from "./journal-entry";
import { useState } from "react";
import { CreateEntryButton } from "./create-entry-button";
import { useUser } from "@clerk/nextjs";
import { JournalSearch } from "./journal-search";
import { containsQuery } from "~/lib/utils";

interface JournalContentProps {
  entries: JournalEntry[];
  role: "therapist" | "member";
}

export function JournalContent({ entries, role }: JournalContentProps) {
  const { user, isLoaded } = useUser();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [search, setSearch] = useState<string>("");
  if (!isLoaded) {
    return <Loader className="animate-spin text-muted-foreground" />;
  }
  const userId = parseInt(user?.unsafeMetadata.databaseId as string);
  return (
    <PageWrapper actions={<CreateEntryButton userId={userId} />}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="flex flex-col gap-4 p-4" minSize={30}>
          <JournalSearch
            role={role}
            entries={entries}
            value={search}
            setValue={setSearch}
          />
          <JournalList
            entries={entries.filter((entry) =>
              containsQuery(entry.title, search),
            )}
            selected={entry}
            onSelect={setEntry}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30} className="p-4">
          <JournalDisplay userId={userId} entry={entry} setEntry={setEntry} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </PageWrapper>
  );
}
