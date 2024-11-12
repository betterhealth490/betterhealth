import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

export default function VisitorLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            {/* TODO: Replace this with an actual navbar */}
            <SignedOut>
                <div className="absolute top-0 z-50 flex w-full justify-end gap-2 p-4">
                    <SignInButton>
                        <Button variant="outline">Sign in</Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button variant="outline">Sign up</Button>
                    </SignUpButton>
                </div>
            </SignedOut>
            {children}
        </div>
    );
}
