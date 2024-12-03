import React from "react";
import { Breadcrumbs } from "~/components/user/breadcrumbs";

export function PageWrapper({
  actions,
  children,
}: {
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex max-h-screen w-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <Breadcrumbs />
        {actions}
      </div>
      <div className="flex-grow overflow-auto">{children}</div>
    </div>
  );
}
