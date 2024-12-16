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
import {
  deactivateTherapistAction,
  reactivateTherapistAction,
} from "./actions";
import { useUser } from "@clerk/nextjs";

const formSchema = z.object({
  currentPassword: z.string(),
});

export function DeactivateTab({
  active,
  userId,
  password,
}: {
  active: boolean;
  userId: number;
  password: string | undefined;
}) {
  const { user } = useUser();
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
  const onDeactivate = async (_: z.infer<typeof formSchema>) => {
    await user?.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        active: false,
      },
    });
    const result = await deactivateTherapistAction(userId);
    if (result.ok) {
      toast({
        title: "Account deactivated",
      });
    } else {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Try again in a few moments",
      });
    }
  };
  const onReactivate = async () => {
    await user?.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        active: true,
      },
    });
    const result = await reactivateTherapistAction(userId);
    if (result.ok) {
      toast({
        title: "Account reactivated",
      });
    } else {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Try again in a few moments",
      });
    }
  };

  return (
    <Card>
      <CardContent className="h-fit w-fit p-4">
        {!active ? (
          <Button onClick={() => onReactivate()}>Reactivate Account</Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Deactivate Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onDeactivate)}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      All appointments, requests, and relationships will be
                      cancelled until you reactivate.
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
                            type="password"
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
