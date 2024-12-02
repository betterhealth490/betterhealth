import React from "react";

export function PageWrapper({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex h-16 items-center justify-between">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {actions}
      </div>
      {children}
    </div>
  );
}
