"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { createMemberAction, createTherapistAction } from "./actions";
import { memberFormSchema, therapistFormSchema } from "./schema";
import { isDefined } from "~/lib/utils";
import { useState } from "react";
import { Loader, Stethoscope, User } from "lucide-react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignUpError } from "~/entities/errors";
import { Loading } from "~/components/loading";
import { useToast } from "~/hooks/use-toast";

export function SignUpForm() {
  const [page, setPage] = useState<"start" | "member" | "therapist">("start");
  return (
    <div>
      {page === "start" && (
        <PageOne
          onClick={(value) => {
            setPage(value);
          }}
        />
      )}
      {page === "member" && (
        <MemberSignUpForm
          onClick={(value) => {
            setPage(value);
          }}
        />
      )}
      {page === "therapist" && (
        <TherapistSignUpForm
          onClick={(value) => {
            setPage(value);
          }}
        />
      )}
    </div>
  );
}

function PageOne({
  onClick,
}: {
  onClick: (value: "start" | "member" | "therapist") => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Are you signing up as a...</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[200px] w-[500px] gap-2">
        <button
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border p-3 text-left text-xl font-medium transition-all hover:bg-accent"
          onClick={() => onClick("member")}
        >
          <User className="h-8 w-8" />
          Member
        </button>
        <button
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border p-3 text-left text-xl font-medium transition-all hover:bg-accent"
          onClick={() => onClick("therapist")}
        >
          <Stethoscope className="h-8 w-8" />
          Therapist
        </button>
      </CardContent>
    </Card>
  );
}

function MemberSignUpForm({
  onClick,
}: {
  onClick: (value: "start" | "member" | "therapist") => void;
}) {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { toast } = useToast();
  const memberForm = useForm<z.infer<typeof memberFormSchema>>({
    resolver: zodResolver(memberFormSchema),
  });

  if (!isLoaded) {
    return <></>;
  }

  const onSubmit = async (values: z.infer<typeof memberFormSchema>) => {
    try {
      const [data, error] = await createMemberAction(values);
      if (isDefined(error)) {
        toast({
          variant: "destructive",
          title: "An error occurred during signup",
          description: "Try again in a few moments",
        });
      } else {
        if (isDefined(data)) {
          const { user } = data;
          const signUpAttempt = await signUp.create({
            ...values,
            emailAddress: values.email,
            unsafeMetadata: {
              databaseId: user.userId,
              role: user.role,
              questionnaireCompleted: false,
              active: true,
            },
          });
          if (signUpAttempt.status === "complete") {
            await setActive({ session: signUpAttempt.createdSessionId });
            router.push("/dashboard");
          } else {
            throw new SignUpError();
          }
        }
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "An error occurred during signup",
        description: "Try again in a few moments",
      });
    }
  };

  return (
    <Form {...memberForm}>
      <form onSubmit={memberForm.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Sign up as a Member</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-4">
              <FormField
                control={memberForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={memberForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={memberForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={memberForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
            <div className="flex w-full justify-between gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onClick("start")}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={memberForm.formState.isSubmitting}
              >
                {memberForm.formState.isSubmitting && (
                  <Loader className="size-4 animate-spin" />
                )}
                Submit
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

function TherapistSignUpForm({
  onClick,
}: {
  onClick: (value: "start" | "member" | "therapist") => void;
}) {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { toast } = useToast();
  const therapistForm = useForm<z.infer<typeof therapistFormSchema>>({
    resolver: zodResolver(therapistFormSchema),
  });
  if (!isLoaded) {
    return <Loading />;
  }
  const onSubmit = async (values: z.infer<typeof therapistFormSchema>) => {
    try {
      const [data, error] = await createTherapistAction(values);
      if (isDefined(error)) {
        toast({
          variant: "destructive",
          title: "An error occurred during signup",
          description: "Try again in a few moments",
        });
      } else {
        if (isDefined(data)) {
          const { user } = data;
          const signUpAttempt = await signUp.create({
            ...values,
            emailAddress: values.email,
            unsafeMetadata: {
              databaseId: user.userId,
              role: user.role,
              questionnaireCompleted: false,
              active: true,
            },
          });
          if (signUpAttempt.status === "complete") {
            await setActive({ session: signUpAttempt.createdSessionId });
            router.push("/dashboard");
          } else {
            throw new SignUpError();
          }
        }
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "An error occurred during signup",
        description: "Try again in a few moments",
      });
    }
  };

  return (
    <Form {...therapistForm}>
      <form onSubmit={therapistForm.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Sign up as a Therapist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-4">
              <FormField
                control={therapistForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={therapistForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={therapistForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={therapistForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={therapistForm.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
            <div className="flex w-full justify-between gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onClick("start")}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={therapistForm.formState.isSubmitting}
              >
                {therapistForm.formState.isSubmitting && (
                  <Loader className="size-4 animate-spin" />
                )}
                Submit
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
