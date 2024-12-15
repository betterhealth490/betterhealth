import { formatDistanceToNow } from "date-fns";
import { cn } from "~/lib/utils";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type JournalEntry } from "./journal-entry";

interface JournalListProps {
  entries: JournalEntry[];
  selected: JournalEntry | null;
  onSelect: (item: JournalEntry) => void;
}

export function JournalList({ entries, selected, onSelect }: JournalListProps) {
  return (
    <ScrollArea className="-mr-2">
      <div className="mr-2 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {entries.length > 0 ? (
            entries.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  selected?.id === item.id && "bg-muted",
                )}
                onClick={async () => onSelect(item)}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="font-semibold">{item.title}</span>
                      </div>
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
              No entries found
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
