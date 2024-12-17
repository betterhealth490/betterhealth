"use client";

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

function getStatusValue(
  status: "current" | "accepting" | "not accepting" | "pending",
) {
  switch (status) {
    case "current":
      return 1;
    case "pending":
      return 2;
    case "accepting":
      return 3;
    default:
      return 4;
  }
}

export function compareStatuses(
  a: { status: "current" | "accepting" | "not accepting" | "pending" },
  b: { status: "current" | "accepting" | "not accepting" | "pending" },
) {
  return getStatusValue(a.status) - getStatusValue(b.status);
}
