'use client'

import { ItemList } from "~/components/user/item-list";
import { ChatBox } from "./chat-box";
import { useState } from "react";
import { isDefined } from "~/lib/utils";
import { InboxItem } from "~/entities/inbox";
import { mockInbox } from "./mock-data";

export default function InboxPage() {
  const [inboxItem, setInboxItem] = useState<InboxItem>();

  return (
    <div>
      <div className="flex h-[90svh]">
        <ItemList items={mockInbox} currentItem={inboxItem} onItemClick={setInboxItem}/>
        { isDefined(inboxItem) && <ChatBox item={inboxItem}/> }
      </div>
    </div>
  );
}
