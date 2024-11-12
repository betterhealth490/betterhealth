import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

export default function UserLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            {/* TODO: Replace this with the app sidebar */}
            <SignedIn>
                <div className="absolute top-0 z-50 flex w-full justify-end gap-2 p-4">
                    <SignOutButton>
                        <Button variant="outline">Log out</Button>
                    </SignOutButton>
                </div>
            </SignedIn>
            {children}
        </div>
    );
}
