import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "~/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { formatName } from "~/lib/utils";

export interface TherapistSurvey {
  id: number;
  patient: {
    id: number;
    firstName: string;
    lastName: string;
  };
  date: Date;
  sleepTime: number;
  sleepLength: number;
  sleepQuality: number;
  waterIntake: number;
  foodIntake: number;
  foodHealthQuality: number;
  stressLevel: number;
  selfImage: number;
}

export const columns: ColumnDef<TherapistSurvey>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return <div>{format(row.original.date, "PPP")}</div>;
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
    filterFn: ({ original: { patient } }, columnId, filterValue: number[]) =>
      filterValue.some((val) => patient.id === val),
    sortingFn: (a, b) =>
      formatName(b.original.patient).localeCompare(
        formatName(a.original.patient),
      ),
    enableHiding: false,
  },
  {
    accessorKey: "waterIntake",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Water Intake" />
    ),
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.waterIntake}</Badge>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "foodIntake",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Food Intake" />
    ),
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.foodIntake}</Badge>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "foodHealthQuality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Food Quality" />
    ),
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.foodHealthQuality}</Badge>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "sleepTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sleep Time" />
    ),
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.sleepTime}</Badge>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "sleepLength",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sleep Length" />
    ),
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.sleepLength}</Badge>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "sleepQuality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sleep Quality" />
    ),
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.sleepQuality}</Badge>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "stressLevel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stress Level" />
    ),
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.stressLevel}</Badge>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "selfImage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Self Image" />
    ),
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.selfImage}</Badge>;
    },
    enableSorting: false,
  },
];
