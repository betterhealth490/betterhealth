import * as React from "react";
import { Check } from "lucide-react";

import { cn, containsQuery, isDefined } from "~/lib/utils";
import {
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Command } from "cmdk";
import { type JournalEntry } from "./journal-entry";
import { useRef, useState } from "react";
import { Input } from "~/components/ui/input";

type InboxSearchProps = {
  role: "therapist" | "member";
  entries: JournalEntry[];
  value: string;
  setValue: (value: string) => void;
};

export function JournalSearch({
  role,
  entries,
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
          role === "therapist"
            ? "Search entries by patient..."
            : "Search entries by title..."
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
          {role === "therapist" &&
            isDefined(
              entries?.find((entry) => containsQuery(entry.author.name, value)),
            ) && (
              <CommandList className="rounded-lg ring-1 ring-slate-200">
                <CommandGroup>
                  {entries.map((patient) => (
                    <CommandItem
                      key={patient.id}
                      value={patient.author.name}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => {
                        setValue(patient.author.name);
                        setOpen(false);
                        inputRef.current?.blur();
                      }}
                    >
                      {patient.author.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === patient.author.name
                            ? "opacity-100"
                            : "opacity-0",
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
