"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { z } from "zod";
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
import { useState } from "react";
import { Label } from "~/components/ui/label";
import { Loader } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignUpError } from "~/entities/errors";
import { cn, doHyeon } from "~/lib/utils";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export function LogInForm() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [message, setMessage] = useState("");
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  if (!isLoaded) {
    return <></>;
  }

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const signInAttempt = await signIn.create({
        identifier: values.email,
        password: values.password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/dashboard");
      } else {
        throw new SignUpError();
      }
    } catch (e) {
      setMessage("Invalid email or password");
    }
  };

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)}>
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>
              Log in to{" "}
              <span className={cn("text-3xl text-primary", doHyeon.className)}>
                betterhealth
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={loginForm.control}
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
              control={loginForm.control}
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
            <Button
              type="submit"
              className="w-full"
              disabled={loginForm.formState.isSubmitting}
            >
              {loginForm.formState.isSubmitting && (
                <Loader className="size-4 animate-spin" />
              )}
              Submit
            </Button>
            <Label className="text-destructive">{message}</Label>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
