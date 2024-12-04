import React, { HTMLAttributes } from "react";
import { Breadcrumbs } from "~/components/user/breadcrumbs";
import { cn } from "~/lib/utils";

export function PageWrapper({
  actions,
  children,
  className,
}: {
  actions?: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex max-h-screen w-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <Breadcrumbs />
        {actions}
      </div>
      <div className={cn("flex-grow overflow-auto", className)}>{children}</div>
    </div>
  );
}
