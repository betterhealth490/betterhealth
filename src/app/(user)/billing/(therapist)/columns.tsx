import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "~/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { formatName, isDefined } from "~/lib/utils";
import { DataTableRowActions } from "./data-table-row-actions";
import { type DateRange } from "react-day-picker";

export interface Billing {
  id: number;
  therapistId: number;
  dueDate: Date;
  patient: {
    id: number;
    firstName: string;
    lastName: string;
  };
  amount: number;
  status: "pending" | "paid";
}

export const columns: ColumnDef<Billing>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due" />
    ),
    cell: ({ row }) => {
      return <div>{format(row.original.dueDate, "PPP")}</div>;
    },
    filterFn: (row, columnId, filterValue: DateRange | undefined) => {
      if (!isDefined(filterValue)) {
        return true;
      }
      const after = filterValue.from
        ? row.original.dueDate >= filterValue.from
        : true;
      const before = filterValue.to
        ? row.original.dueDate <= filterValue.to
        : true;
      return after && before;
    },
    enableHiding: false,
  },
  {
    accessorKey: "patient",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient" />
    ),
    cell: ({ row }) => {
      return <div>{formatName(row.original.patient)}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Due" />
    ),
    cell: ({ row }) => {
      return <div>${row.original.amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <Badge
          className="capitalize"
          variant={row.original.status === "paid" ? "outline" : "default"}
        >
          {row.original.status}
        </Badge>
      );
    },
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) =>
      row.original.status === "pending" ? (
        <DataTableRowActions row={row} />
      ) : (
        <></>
      ),
    enableHiding: false,
  },
];
