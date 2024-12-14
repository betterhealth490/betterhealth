"use client"

import { ColumnDef, FilterFn, RowData } from "@tanstack/react-table"
import { Checkbox } from "~/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Task } from "../data/schema"
import { Button } from "~/components/ui/button"
import { id } from "date-fns/locale"
import { DataTableRowActions } from "./data-table-row-actions"
import { status } from "../data/data"
import { Badge } from "~/components/ui/badge"

const customFn: FilterFn<any> = (
  row,
  columnId: string,
  filterValue: [number, number][]
) => {
  const rowValue = row.getValue<number>(columnId);  
  return filterValue.some(([min,max]) => 
    rowValue >= min && rowValue <= max
  );
}

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
    filterFn: customFn
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => <div className="w-[80px] capitalize">{row.getValue("gender")}</div>,
    filterFn: "arrIncludesSome"
  },
  {
    accessorKey: "specialty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Specialty" />
    ),
    cell: ({ row }) => <div className="w-[80px] capitalize">{row.getValue("specialty")}</div>,
    filterFn: "arrIncludesSome"
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const label = status.find((label) => label.value === row.original.status)
      switch(row.getValue("status")){
        case "available":
          return label && <Badge variant="outline">{label.label}</Badge>
        case "current":
          return label && <Badge variant="default">{label.label}</Badge>
        case "pending":
          return label && <Badge variant="secondary">{label.label}</Badge>
        case "inactive":
          return label && <Badge variant="secondary">{label.label}</Badge>
      }
    },
    filterFn: "arrIncludesSome"
  },
  {
    id: "actions",
    cell: ({row}) => <DataTableRowActions row={row}/>
  },
]