import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import addDays from "date-fns/addDays";
import addHours from "date-fns/addHours";
import format from "date-fns/format";
import nextSaturday from "date-fns/nextSaturday";
import {
  Archive,
  ArchiveX,
  Trash2,
  Clock,
  Calendar,
  Reply,
  ReplyAll,
  Forward,
  MoreVertical,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Card, CardContent } from "~/components/ui/card";

interface InboxDisplayProps {
  message: {
    id: number;
    name: string;
    subject: string;
    email: string;
    date: Date;
    text: string;
  } | null;
}

export function InboxDisplay({ message }: InboxDisplayProps) {
  const today = new Date();

  return (
    <Card className="h-full">
      <CardContent className="h-full p-0">
        <div className="flex h-full flex-col">
          {message ? (
            <div className="flex flex-1 flex-col">
              <div className="flex items-start p-4">
                <div className="flex items-start gap-4 text-sm">
                  <Avatar>
                    <AvatarImage alt={message.name} />
                    <AvatarFallback>
                      {message.name
                        .split(" ")
                        .map((chunk) => chunk[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-semibold">{message.name}</div>
                    <div className="line-clamp-1 text-xs">
                      {message.subject}
                    </div>
                    <div className="line-clamp-1 text-xs">{message.email}</div>
                  </div>
                </div>
                {message.date && (
                  <div className="ml-auto text-xs text-muted-foreground">
                    {format(new Date(message.date), "PPpp")}
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
                {message.text}
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
