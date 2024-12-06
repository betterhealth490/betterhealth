import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import format from "date-fns/format";
import { Card, CardContent } from "~/components/ui/card";
import { JournalEntry } from "./journal-entry";
import { formatInitialsByString } from "~/lib/utils";

interface JournalDisplayProps {
  entry: JournalEntry | null;
}

export function JournalDisplay({ entry }: JournalDisplayProps) {
  return (
    <Card className="h-full">
      <CardContent className="h-full p-0">
        <div className="flex h-full flex-col">
          {entry ? (
            <div className="flex flex-1 flex-col">
              <div className="flex items-start p-4">
                <div className="flex items-start gap-4 text-sm">
                  <Avatar>
                    <AvatarImage alt={entry.author.name} />
                    <AvatarFallback>
                      {formatInitialsByString(entry.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-semibold">{entry.title}</div>
                  </div>
                </div>
                {entry.date && (
                  <div className="ml-auto text-xs text-muted-foreground">
                    {format(new Date(entry.date), "PPpp")}
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
                {entry.text}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No entry selected
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
