"use client";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "~/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Card, CardContent } from "~/components/ui/card";
import { deleteMemberAction } from "./actions";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

const formSchema = z.object({
  currentPassword: z.string(),
});

export function DeleteTab({
  pendingBills,
  userId,
  password,
}: {
  pendingBills?: boolean;
  userId: number;
  password: string | undefined;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(
      formSchema.refine(
        (values) => {
          return values.currentPassword === password;
        },
        {
          message: "Does not match current password",
          path: ["currentPassword"],
        },
      ),
    ),
  });
  const onSubmit = async (_: z.infer<typeof formSchema>) => {
    const result = await deleteMemberAction(userId);
    if (result.ok) {
      toast({
        title: "Account deleted.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Try again in a few moments",
      });
    }
  };

  return (
    <Card>
      <CardContent className="h-fit w-fit p-4">
        {pendingBills ? (
          <HoverCard>
            <HoverCardTrigger>
              <Button variant="destructive" disabled>
                Delete Account
              </Button>
            </HoverCardTrigger>
            <HoverCardContent side="right">
              You cannot delete your account until all pending bills are paid.
            </HoverCardContent>
          </HoverCard>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem className="mb-6 mt-4">
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your current password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button type="submit" variant="destructive">
                      Confirm
                    </Button>
                  </AlertDialogFooter>
                </form>
              </Form>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
}
