"use client";

import { compareStatuses } from "../../utils";
import { columns, type Patient } from "./columns";
import { DataTable } from "./data-table";

export function TherapistPatientList({ patients }: { patients: Patient[] }) {
  const sortedPatients = patients.sort(compareStatuses);
  return <DataTable columns={columns} data={sortedPatients} />;
}
