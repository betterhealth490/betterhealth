"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "~/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";

export interface Survey {
  id: number;
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

export const columns: ColumnDef<Survey>[] = [
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
