"use client";

import { Button } from "~/components/ui/button";
import { deleteUsersAction, migrateUsersAction } from "./actions";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const { pending } = useFormStatus();
    const [message, setMessage] = useState<string>("");
    if (process.env.NODE_ENV !== "development") {
        notFound();
    }
    return (
        <div className="m-96 flex gap-4">
            <Button
                className="flex gap-2"
                disabled={pending}
                onClick={async () => {
                    const result = await migrateUsersAction();
                    if (result.ok) {
                        setMessage("");
                    } else {
                        setMessage(result.error);
                    }
                }}
            >
                {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Migrate
            </Button>
            <Button
                className="flex gap-2"
                disabled={pending}
                onClick={async () => {
                    const result = await deleteUsersAction();
                    if (result.ok) {
                        setMessage("");
                    } else {
                        setMessage(result.error);
                    }
                }}
                variant="destructive"
            >
                {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Delete
            </Button>
            <span className="text-2xl font-semibold">{message}</span>
        </div>
    );
}
