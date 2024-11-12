import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function TestPage() {
    if (process.env.NODE_ENV !== "development") {
        notFound();
    }
    return <Button>Click me</Button>;
}
