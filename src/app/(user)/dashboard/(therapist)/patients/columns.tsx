import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "~/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { formatName } from "~/lib/utils";
import { z } from "zod";
import { DataTableRowActions } from "./data-table-row-actions";
import { ageEnum, genderEnum, specialtyEnum } from "~/db/schema";

export type Patient = z.infer<typeof patientSchema>;

export const patientSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  agePreference: z.enum(ageEnum.enumValues).nullable(),
  genderPreference: z.enum(genderEnum.enumValues).nullable(),
  specialtyPreference: z.enum(specialtyEnum.enumValues).nullable(),
  status: z.enum(["current", "pending"]),
});

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return <div>{formatName(row.original)}</div>;
    },
    sortingFn: (a, b) =>
      formatName(a.original).localeCompare(formatName(b.original)),
    filterFn: (row, _, filterValue) =>
      formatName(row.original)
        .toLowerCase()
        .includes(filterValue.toLowerCase()),
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) =>
      row.original.status === "current" ? (
        <Badge>Current</Badge>
      ) : (
        <Badge variant="secondary">Pending</Badge>
      ),
    enableSorting: false,
  },
  {
    accessorKey: "agePreference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age Preference" />
    ),
    cell: ({ row }) =>
      row.original.agePreference ? (
        <div className="capitalize">{row.original.agePreference ?? "-"}</div>
      ) : (
        <div className="text-muted-foreground">-</div>
      ),

    enableSorting: false,
  },
  {
    accessorKey: "genderPreference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender Preference" />
    ),
    cell: ({ row }) =>
      row.original.genderPreference ? (
        <div className="capitalize">{row.original.genderPreference ?? "-"}</div>
      ) : (
        <div className="text-muted-foreground">-</div>
      ),

    enableSorting: false,
  },
  {
    accessorKey: "specialtyPreference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Specialty Preference" />
    ),
    cell: ({ row }) =>
      row.original.specialtyPreference ? (
        <div className="capitalize">
          {row.original.specialtyPreference === "lgbtq"
            ? "LGBTQ+"
            : row.original.specialtyPreference}
        </div>
      ) : (
        <div className="text-muted-foreground">-</div>
      ),
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
