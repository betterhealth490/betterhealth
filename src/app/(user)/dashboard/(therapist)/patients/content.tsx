"use client";

import { columns, type Patient } from "./columns";
import { DataTable } from "./data-table";

export function TherapistPatientList({ patients }: { patients: Patient[] }) {
  return <DataTable columns={columns} data={patients} />;
}
