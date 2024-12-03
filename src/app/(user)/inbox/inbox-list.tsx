import { formatDistanceToNow } from "date-fns";
import { cn } from "~/lib/utils";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type Message } from "./message";
import { readMessageAction } from "./actions";

interface InboxListProps {
  items: Message[];
  selected: Message | null;
  onSelect: (item: Message) => void;
  userId: number;
}

export function InboxList({
  items,
  selected,
  onSelect,
  userId,
}: InboxListProps) {
  return (
    <ScrollArea className="-mr-2">
      <div className="mr-2 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {items.length > 0 ? (
            items.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  selected?.id === item.id && "bg-muted",
                )}
                onClick={async () => {
                  if (!item.read && item.sender.id !== userId) {
                    item.read = true;
                    await readMessageAction(item.id);
                  }
                  onSelect(item);
                }}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="font-semibold">
                          {item.sender.id === userId ? "You" : item.sender.name}
                        </span>{" "}
                        to{" "}
                        {item.recipient.id === userId
                          ? "You"
                          : item.recipient.name}
                      </div>
                      {!item.read && item.sender.id !== userId && (
                        <span className="flex h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs",
                        selected?.id === item.id
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {formatDistanceToNow(new Date(item.date), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {item.text.substring(0, 300)}
                </div>
              </button>
            ))
          ) : (
            <div className="hw-full flex justify-center text-muted-foreground">
              No messages found
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
