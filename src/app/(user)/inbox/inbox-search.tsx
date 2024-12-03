import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn, containsQuery, isDefined } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Command } from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { InboxUser } from "./message";
import { useRef, useState } from "react";
import { Input } from "~/components/ui/input";

interface InboxSearchProps {
  role: "therapist" | "patient";
  users: InboxUser[];
  value: string;
  setValue: (value: string) => void;
}

export function InboxSearch({
  role,
  users,
  value,
  setValue,
}: InboxSearchProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Command>
      <Input
        ref={inputRef}
        placeholder={
          role === "therapist" ? "Search patients..." : "Search therapists..."
        }
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        className="text-base"
      />
      <div className="relative">
        <div
          className={cn(
            "absolute top-0 z-10 mt-2 w-full rounded-xl bg-white outline-none animate-in fade-in-0 zoom-in-95",
            open ? "block" : "hidden",
          )}
        >
          {isDefined(
            users.find((therapist) => containsQuery(therapist.name, value)),
          ) && (
            <CommandList className="rounded-lg ring-1 ring-slate-200">
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.name}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onSelect={() => {
                      setValue(user.name);
                      setOpen(false);
                      inputRef.current?.blur();
                    }}
                  >
                    {user.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === user.name ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </div>
      </div>
    </Command>
  );
}
