"use client";

import { Button } from "~/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "~/hooks/use-toast";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
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

const formSchema = z.object({
  currentPassword: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AccountTab({
    userId,
  password,
}: {
    userId: number
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
  const onSubmit = async () => {
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
                        <Input placeholder="current password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Type your current password here to confirm account
                        deletion.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit" variant="destructive">
                    Delete Account
                  </Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
