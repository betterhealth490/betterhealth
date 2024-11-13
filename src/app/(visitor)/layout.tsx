import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Navbar } from "~/components/visitor/navbar";

export default function VisitorLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            <Navbar/>
            {children}
        </div>
    );
}
