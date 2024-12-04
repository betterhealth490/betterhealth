"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { PageWrapper } from "../page-wrapper";

interface ScheduleAppointmentProps {
  date: Date | undefined;
}

const formSchema = z.object({
  therapist: z.string({
    errorMap: () => {
      return { message: "Please select a therapist." };
    },
  }),
  timeslot: z.string({
    errorMap: () => {
      return { message: "Please select a timeslot." };
    },
  }),
  duration: z.string(),
  status: z.string(),
  notes: z.string(),
});

const therapistNames = [
  "Joe John",
  "Joe Joe",
  "John Joe",
  "John John",
  "Jonathan",
];
const timeslots = ["12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM"];

export function ScheduleAppointment({ date }: ScheduleAppointmentProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      therapist: undefined,
      timeslot: undefined,
      duration: "30 minutes",
      status: "Pending",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const [therapist, setTherapist] = useState("Select an available therapist");
  const [timeslot, setTimeslot] = useState("Select an available timeslot");
  const [notes, setNotes] = useState("");

  const therapistClick = (tName: string) => {
    setTherapist(tName);
  };
  const timeslotClick = (time: string) => {
    setTimeslot(time);
  };
  const notesChange = (note: string) => {
    setNotes(note);
  };

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Create Your Appointment</CardTitle>
        <CardDescription>{date?.toDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex h-full flex-col gap-y-8">
              <div className="flex w-full justify-between gap-x-8">
                <FormField
                  name="therapist"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Therapist</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a therapist"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {therapistNames.map((name) => (
                            <SelectItem value={name}>{name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeslot"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a timeslot"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeslots.map((time) => (
                            <SelectItem value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full justify-between gap-x-8">
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <span className="text-sm">30 Minutes</span>
                  </FormControl>
                </FormItem>
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <span className="text-sm">Pending</span>
                  </FormControl>
                </FormItem>
              </div>
              <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                <FormItem className="flex h-full w-full flex-col">
                  <FormLabel>Notes</FormLabel>
                  <FormControl className="flex max-h-full rounded-[8px] border-2 p-2">
                    <textarea
                      className="resize-y max-h-[550px] min-h-[50px]"
                      placeholder="Write any notes for the appointment here..."
                      onKeyUp={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormControl>
                </FormItem>
                  )}
              />
            </div>
            <Button
              type="submit"
              className="flex w-fit place-self-end rounded-[8px] text-lg"
              onClick={form.handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

{/* <SelectItem
title={tName}
onClick={() => {
  therapistClick(tName);
  form.setValue("therapist", tName);
  return;
}}
/> */}