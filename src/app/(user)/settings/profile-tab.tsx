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
import { useRouter } from "next/navigation";
import { updateProfileAction } from "./actions";
import { Card, CardContent } from "~/components/ui/card";

const profileFormSchema = z.object({
  firstName: z.string().min(3).max(100),
  lastName: z.string().min(3).max(100),
  email: z.string().min(7).max(255).email(),
  currentPassword: z.string().min(8).max(255).optional(),
  newPassword: z.string().min(8).max(255).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileTab({
  userId,
  firstName,
  lastName,
  email,
  password,
}: {
  userId: number;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  password: string | undefined;
}) {
  const router = useRouter();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(
      profileFormSchema.refine(
        (values) => {
          return !values.newPassword || values.currentPassword === password;
        },
        {
          message: "Does not match current password",
          path: ["currentPassword"],
        },
      ),
    ),
    defaultValues: {
      firstName,
      lastName,
      email,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: ProfileFormValues) => {
    const result = await updateProfileAction(userId, {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.newPassword,
    });
    if (result.ok) {
      router.push("/settings");
      toast({
        title: "Profile updated",
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
      <CardContent className="space-y-6 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex w-full gap-12">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Change your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl className="w-full">
                      <Input placeholder="Change your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Change your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
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
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your new password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
