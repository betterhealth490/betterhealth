"use client";

import { DataTable } from "./data-table";
import { type Billing, columns } from "./columns";

export function TherapistBilling({ billings }: { billings: Billing[] }) {
  return (
    <div className="p-4">
      <DataTable columns={columns} data={billings} />
    </div>
  );
}
