import { mockMessages } from "./message";
import { InboxContent } from "./inbox-content";

export default function InboxPage() {
  return <InboxContent messages={mockMessages} />;
}
