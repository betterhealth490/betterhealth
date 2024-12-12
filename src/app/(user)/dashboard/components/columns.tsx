"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "~/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Task } from "../data/schema"
import { Button } from "~/components/ui/button"

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("email")}</div>
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("age")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("gender")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "specialty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Specialty" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("specialty")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "available",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Request Therapist" />
    ),
    cell: ({ row }) => {
      return (row.original.available === "true")
      ? <Button>Request</Button> 
      : <Button disabled={true} variant={"secondary"}>Unavailable</Button>
    },
  },
]