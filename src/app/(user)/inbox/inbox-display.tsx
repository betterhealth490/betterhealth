import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import format from "date-fns/format";
import { Card, CardContent } from "~/components/ui/card";
import { Message } from "./message";
import { formatInitialsByString } from "~/lib/utils";

interface InboxDisplayProps {
  item: Message | null;
}

export function InboxDisplay({ item }: InboxDisplayProps) {
  return (
    <Card className="h-full">
      <CardContent className="h-full p-0">
        <div className="flex h-full flex-col">
          {item ? (
            <div className="flex flex-1 flex-col">
              <div className="flex items-start p-4">
                <div className="flex items-start gap-4 text-sm">
                  <Avatar>
                    <AvatarImage alt={item.sender.name} />
                    <AvatarFallback>
                      {formatInitialsByString(item.sender.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div>
                      <span className="font-semibold">{item.sender.name}</span>{" "}
                      to
                    </div>
                    <div className="line-clamp-1">{item.recipient.name}</div>
                  </div>
                </div>
                {item.date && (
                  <div className="ml-auto text-xs text-muted-foreground">
                    {format(new Date(item.date), "PPpp")}
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
                {item.text}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No message selected
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
