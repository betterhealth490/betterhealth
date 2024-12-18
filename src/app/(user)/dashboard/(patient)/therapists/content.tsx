"use client";

import { compareStatuses } from "../../utils";
import { generateColumns, type Therapist } from "./columns";
import { DataTable } from "./data-table";

export function PatientTherapistList({
  therapists,
}: {
  therapists: Therapist[];
}) {
  const sortedTherapists = therapists.sort(compareStatuses);
  return (
    <DataTable
      columns={generateColumns(therapists.some((t) => t.status === "current"))}
      data={sortedTherapists}
    />
  );
}
