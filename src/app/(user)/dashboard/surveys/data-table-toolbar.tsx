"use client";

import { type Table } from "@tanstack/react-table";
import { Filter, X } from "lucide-react";

import { Button } from "~/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { CalendarDateRangePicker } from "./date-range-picker";
import { type DateRange } from "react-day-picker";
import { DataTableViewSwitcher } from "./data-table-view-switcher";
import { formatCamelCase } from "~/lib/utils";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  view: "table" | "line";
  setView: (view: "table" | "line") => void;
  date: DateRange | undefined;
  setDate: (value: DateRange | undefined) => void;
}

export function DataTableToolbar<TData>({
  table,
  date,
  setDate,
  view,
  setView,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <CalendarDateRangePicker date={date} setDate={setDate} />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm" className="h-8 font-normal">
              <Filter />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide(),
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "foodHealthQuality"
                      ? "Food Quality"
                      : formatCamelCase(column.id)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewSwitcher view={view} setView={setView} />
    </div>
  );
}
