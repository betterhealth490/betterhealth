"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Icons } from "~/components/ui/icons";
import { Do_Hyeon } from "next/font/google";

const doHyeon = Do_Hyeon({
    weight: "400",
    subsets: ["latin"],
});

export function SignInForm() {
    return (
        <SignIn.Root>
            <Clerk.Loading>
                {(isGlobalLoading) => (
                    <>
                        <SignIn.Step name="start">
                            <Card className="w-full sm:w-96">
                                <CardHeader>
                                    <CardTitle>
                                        Log in to{" "}
                                        <span
                                            className={"text-3xl text-primary " + doHyeon.className}
                                        >
                                            betterhealth
                                        </span>
                                    </CardTitle>
                                    <CardDescription>
                                        Welcome back! Please sign in to continue
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-y-4">
                                    <Clerk.Field name="identifier" className="space-y-2">
                                        <Clerk.Label asChild>
                                            <Label>Email address</Label>
                                        </Clerk.Label>
                                        <Clerk.Input type="email" required asChild>
                                            <Input />
                                        </Clerk.Input>
                                        <Clerk.FieldError className="block text-sm text-destructive" />
                                    </Clerk.Field>
                                </CardContent>
                                <CardFooter>
                                    <div className="grid w-full gap-y-4">
                                        <SignIn.Action submit asChild>
                                            <Button disabled={isGlobalLoading}>
                                                <Clerk.Loading>
                                                    {(isLoading) => {
                                                        return isLoading ? (
                                                            <Icons.spinner className="size-4 animate-spin" />
                                                        ) : (
                                                            "Continue"
                                                        );
                                                    }}
                                                </Clerk.Loading>
                                            </Button>
                                        </SignIn.Action>

                                        <Button variant="link" size="sm" asChild>
                                            <Clerk.Link navigate="sign-up">
                                                Don&apos;t have an account? Sign up
                                            </Clerk.Link>
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </SignIn.Step>

                        <SignIn.Step name="choose-strategy">
                            <Card className="w-full sm:w-96">
                                <CardHeader>
                                    <CardTitle>Use another method</CardTitle>
                                    <CardDescription>
                                        Facing issues? You can use any of these methods to sign in.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-y-4">
                                    <SignIn.SupportedStrategy name="email_code" asChild>
                                        <Button
                                            type="button"
                                            variant="link"
                                            disabled={isGlobalLoading}
                                        >
                                            Email code
                                        </Button>
                                    </SignIn.SupportedStrategy>
                                    <SignIn.SupportedStrategy name="password" asChild>
                                        <Button
                                            type="button"
                                            variant="link"
                                            disabled={isGlobalLoading}
                                        >
                                            Password
                                        </Button>
                                    </SignIn.SupportedStrategy>
                                </CardContent>
                                <CardFooter>
                                    <div className="grid w-full gap-y-4">
                                        <SignIn.Action navigate="previous" asChild>
                                            <Button disabled={isGlobalLoading}>
                                                <Clerk.Loading>
                                                    {(isLoading) => {
                                                        return isLoading ? (
                                                            <Icons.spinner className="size-4 animate-spin" />
                                                        ) : (
                                                            "Go back"
                                                        );
                                                    }}
                                                </Clerk.Loading>
                                            </Button>
                                        </SignIn.Action>
                                    </div>
                                </CardFooter>
                            </Card>
                        </SignIn.Step>

                        <SignIn.Step name="verifications">
                            <SignIn.Strategy name="password">
                                <Card className="w-full sm:w-96">
                                    <CardHeader>
                                        <CardTitle>
                                            Log in to{" "}
                                            <span
                                                className={"text-3xl text-primary " + doHyeon.className}
                                            >
                                                betterhealth
                                            </span>
                                        </CardTitle>
                                        <CardDescription>
                                            Enter your password to finish logging in.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-y-4">
                                        <div>
                                            <Label>Email</Label>
                                            <Input disabled value={SignIn.SafeIdentifier({})} />
                                        </div>
                                        <Clerk.Field name="password" className="space-y-2">
                                            <Clerk.Label asChild>
                                                <Label>Password</Label>
                                            </Clerk.Label>
                                            <Clerk.Input type="password" asChild>
                                                <Input />
                                            </Clerk.Input>
                                            <Clerk.FieldError className="block text-sm text-destructive" />
                                        </Clerk.Field>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="grid w-full gap-y-4">
                                            <SignIn.Action submit asChild>
                                                <Button disabled={isGlobalLoading}>
                                                    <Clerk.Loading>
                                                        {(isLoading) => {
                                                            return isLoading ? (
                                                                <Icons.spinner className="size-4 animate-spin" />
                                                            ) : (
                                                                "Continue"
                                                            );
                                                        }}
                                                    </Clerk.Loading>
                                                </Button>
                                            </SignIn.Action>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </SignIn.Strategy>
                        </SignIn.Step>
                    </>
                )}
            </Clerk.Loading>
        </SignIn.Root>
    );
}
