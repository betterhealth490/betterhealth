import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center text-primary">
      <Loader2 className="size-16 animate-spin" />
    </div>
  );
}
