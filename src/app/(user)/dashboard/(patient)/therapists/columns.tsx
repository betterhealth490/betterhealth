import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "~/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { formatName } from "~/lib/utils";
import { z } from "zod";
import { DataTableRowActions } from "./data-table-row-actions";
import { genderEnum, specialtyEnum } from "~/db/schema";
import { compareStatuses } from "../../utils";

export type Therapist = z.infer<typeof therapistSchema>;

export const therapistSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  age: z.number().nullable(),
  gender: z.enum(genderEnum.enumValues).nullable(),
  specialty: z.enum(specialtyEnum.enumValues).nullable(),
  status: z.enum(["current", "accepting", "not accepting", "pending"]),
});

export function generateColumns(hasTherapist: boolean): ColumnDef<Therapist>[] {
  return [
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
      accessorKey: "age",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Age" />
      ),
      cell: ({ row }) =>
        row.original.age ? (
          <div className="capitalize">{row.original.age ?? "-"}</div>
        ) : (
          <div className="text-muted-foreground">-</div>
        ),
      filterFn: (row, _, filterValue: [number, number][]) => {
        const rowValue = row.getValue<number>("age");
        return filterValue.some(
          ([min, max]) => rowValue >= min && rowValue <= max,
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gender" />
      ),
      cell: ({ row }) =>
        row.original.gender ? (
          <div className="capitalize">{row.original.gender ?? "-"}</div>
        ) : (
          <div className="text-muted-foreground">-</div>
        ),
      filterFn: (row, _, filterValue: string[]) => {
        const rowValue = row.getValue<string>("gender");
        return filterValue.some((val) => val === rowValue);
      },
      enableSorting: false,
    },
    {
      accessorKey: "specialty",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Specialty" />
      ),
      cell: ({ row }) =>
        row.original.specialty ? (
          <div className="capitalize">
            {row.original.specialty === "lgbtq"
              ? "LGBTQ+"
              : row.original.specialty}
          </div>
        ) : (
          <div className="text-muted-foreground">-</div>
        ),
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        switch (row.original.status) {
          case "current":
            return <Badge>Current</Badge>;
          case "accepting":
            return <Badge variant="outline">Accepting</Badge>;
          case "not accepting":
            return <Badge variant="outline">Not Accepting</Badge>;
          default:
            return <Badge variant="secondary">Pending</Badge>;
        }
      },
      filterFn: (row, _, filterValue: string[]) => {
        const rowValue = row.getValue<string>("status");
        return filterValue.some((val) => val === rowValue);
      },
      sortingFn: (a, b) => compareStatuses(a.original, b.original),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions hasTherapist={hasTherapist} row={row} />
      ),
    },
  ];
}
