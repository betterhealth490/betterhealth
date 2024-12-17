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
import { therapistSchema } from "./columns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { type z } from "zod";
import { formatName, isDefined } from "~/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useToast } from "~/hooks/use-toast";
import { dropTherapistAction, requestTherapistAction } from "../../actions";
import { useState } from "react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  hasTherapist: boolean;
}

export function DataTableRowActions<TData>({
  row,
  hasTherapist,
}: DataTableRowActionsProps<TData>) {
  const therapist = therapistSchema.parse(row.original);
  if (therapist.status === "current") {
    return <DropAction therapist={therapist} />;
  }
  if (therapist.status === "accepting" && !hasTherapist) {
    return <RequestAction therapist={therapist} />;
  }
  if (therapist.status === "pending" && !hasTherapist) {
    return <WithdrawAction therapist={therapist} />;
  }
  return null;
}

function DropAction({
  therapist,
}: {
  therapist: z.infer<typeof therapistSchema>;
}) {
  const { toast } = useToast();
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const onSubmit = async () => {
    if (!isDefined(user)) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Try again in a few moments",
      });
    } else {
      const userId = parseInt(user.unsafeMetadata.databaseId as string);
      const result = await dropTherapistAction(therapist.id, userId);
      if (result.ok) {
        toast({
          title: "Successfully dropped " + formatName(therapist),
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
          <DialogTrigger asChild>
            <DropdownMenuItem>Drop</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to drop {formatName(therapist)}?
          </DialogTitle>
          <DialogDescription>
            This will cancel all future appointments. Any pending bills will
            still remain.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RequestAction({
  therapist,
}: {
  therapist: z.infer<typeof therapistSchema>;
}) {
  const { toast } = useToast();
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const onSubmit = async () => {
    if (!isDefined(user)) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Try again in a few moments",
      });
    } else {
      const userId = parseInt(user.unsafeMetadata.databaseId as string);
      const result = await requestTherapistAction(therapist.id, userId);
      if (result.ok) {
        toast({
          title: "Successfully requested " + formatName(therapist),
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
          <DialogTrigger asChild>
            <DropdownMenuItem>Request</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to request {formatName(therapist)}?
          </DialogTitle>
          <DialogDescription>
            This will withdraw any requests for other therapists.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WithdrawAction({
  therapist,
}: {
  therapist: z.infer<typeof therapistSchema>;
}) {
  const { toast } = useToast();
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const onSubmit = async () => {
    if (!isDefined(user)) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Try again in a few moments",
      });
    } else {
      const userId = parseInt(user.unsafeMetadata.databaseId as string);
      const result = await dropTherapistAction(therapist.id, userId);
      if (result.ok) {
        toast({
          title: "Successfully withdrew request for " + formatName(therapist),
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
          <DialogTrigger asChild>
            <DropdownMenuItem>Withdraw Request</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to withdraw your request for{" "}
            {formatName(therapist)}?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
