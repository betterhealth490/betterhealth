import { formatDistanceToNow } from "date-fns";
import { cn } from "~/lib/utils";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type Message } from "./message";

interface InboxListProps {
  items: Message[];
  selected: Message | null;
  onSelect: (item: Message) => void;
}

export function InboxList({ items, selected, onSelect }: InboxListProps) {
  return (
    <ScrollArea className="-mr-2">
      <div className="mr-2 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                selected?.id === item.id && "bg-muted",
              )}
              onClick={() => {
                if (!item.read) item.read = true;
                onSelect(item);
              }}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.name}</div>
                    {!item.read && (
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
                <div className="text-xs font-medium">{item.subject}</div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {item.text.substring(0, 300)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
