"use client";

import { type Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { patientSchema } from "./columns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { type z } from "zod";
import { formatName, isDefined } from "~/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useToast } from "~/hooks/use-toast";
import { acceptPatientAction, declinePatientAction } from "../../actions";
import { useState } from "react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const patient = patientSchema.parse(row.original);
  if (patient.status === "pending") {
    return <DeclineAction patient={patient} />;
  }
  return null;
}

function DeclineAction({
  patient,
}: {
  patient: z.infer<typeof patientSchema>;
}) {
  const { toast } = useToast();
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const onDeclineSubmit = async () => {
    if (!isDefined(user)) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Try again in a few moments",
      });
    } else {
      const userId = parseInt(user.unsafeMetadata.databaseId as string);
      const result = await declinePatientAction(userId, patient.id);
      if (result.ok) {
        toast({
          title: "Declined " + formatName(patient) + "'s request",
        });
        setOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Try again in a few moments",
        });
      }
    }
  };
  const onAcceptSubmit = async () => {
    if (!isDefined(user)) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Try again in a few moments",
      });
    } else {
      const userId = parseInt(user.unsafeMetadata.databaseId as string);
      const result = await acceptPatientAction(userId, patient.id);
      if (result.ok) {
        toast({
          title: "Accepted " + formatName(patient) + "'s request",
        });
        setOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Try again in a few moments",
        });
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={onAcceptSubmit}>Accept</DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>Decline</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to decline {formatName(patient)}&apos;s
            request?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onDeclineSubmit}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
