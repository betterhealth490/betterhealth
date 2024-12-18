"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Calendar } from "~/components/ui/calendar";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { cn, formatName } from "~/lib/utils";
import { addDays, format } from "date-fns";
import { createBillForPatientAction } from "./actions";
import { useToast } from "~/hooks/use-toast";
import {
  Popover,
  PopoverDialogContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon, Loader } from "lucide-react";
import { useState } from "react";

const billSchema = z
  .object({
    patient: z.string(),
    amount: z.string(),
    dueDate: z.date(),
  })
  .refine((data) => parseInt(data.amount) >= 1, {
    message: "Please enter an amount greater than or equal to $1.00",
    path: ["amount"],
  })
  .refine(
    (data) =>
      new Date(data.dueDate.toDateString()) >=
      new Date(addDays(new Date(), 1).toDateString()),
    {
      message: "Please select a date later than today",
      path: ["dueDate"],
    },
  );

export function CreateBillForm({
  therapistId,
  patients,
}: {
  therapistId: number;
  patients: { id: number; firstName: string; lastName: string }[];
}) {
  const form = useForm<z.infer<typeof billSchema>>({
    resolver: zodResolver(billSchema),
  });
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof billSchema>) => {
    try {
      await createBillForPatientAction({
        therapistId,
        patientId: parseInt(values.patient),
        amount: parseInt(values.amount),
        dueDate: values.dueDate,
      });
      toast({
        title: "Bill created successfully!",
      });
      setOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Try again in a few moments",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button>Create Bill</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Create a bill</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="patient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Patient</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem
                          key={patient.id}
                          value={patient.id.toString()}
                        >
                          {formatName(patient)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step=".01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Due Date</FormLabel>
                  <Popover modal={false}>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "h-8 justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "LLL dd, y")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverDialogContent className="w-auto p-0" align="end">
                      <FormControl>
                        <Calendar
                          selected={field.value}
                          onSelect={field.onChange}
                          mode="single"
                        />
                      </FormControl>
                    </PopoverDialogContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-row gap-2 sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting && (
                  <Loader className="animate-spin" />
                )}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
