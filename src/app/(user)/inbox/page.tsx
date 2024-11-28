'use client'

import { ItemList } from "~/components/user/item-list";
import { ChatBox } from "./chat-box";
import { useState } from "react";
import { isDefined } from "~/lib/utils";
import { InboxItem } from "~/entities/inbox";
import { mockInbox } from "./mock-data";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";

export default function InboxPage() {
  const [inboxItem, setInboxItem] = useState<InboxItem>();

  return (
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel className="min-w-[25%]" defaultSize={50}>
            <ItemList items={mockInbox} currentItem={inboxItem} onItemClick={setInboxItem}/>
        </ResizablePanel>
        <ResizableHandle/>
        <ResizablePanel className="min-w-[25%] h-full" defaultSize={50}>
            { isDefined(inboxItem) && <ChatBox item={inboxItem}/> }
        </ResizablePanel>
      </ResizablePanelGroup>
  );
}
