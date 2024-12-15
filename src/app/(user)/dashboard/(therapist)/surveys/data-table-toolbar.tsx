import { type Table } from "@tanstack/react-table";
import { Columns, X } from "lucide-react";

import { Button } from "~/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { CalendarDateRangePicker } from "./date-range-picker";
import { type DateRange } from "react-day-picker";
import { DataTableViewSwitcher } from "./data-table-view-switcher";
import { formatCamelCase } from "~/lib/utils";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  view: "table" | "line";
  setView: (view: "table" | "line") => void;
  date: DateRange | undefined;
  setDate: (value: DateRange | undefined) => void;
  filters: {
    row: string;
    options: { label: string; value: string }[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  date,
  setDate,
  view,
  setView,
  filters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <CalendarDateRangePicker date={date} setDate={setDate} />
        {view === "table"
          ? filters.map((filter) => (
              <div key={filter.row}>
                <DataTableFacetedFilter
                  column={table.getColumn(filter.row)}
                  title={filter.row[0]?.toUpperCase() + filter.row.slice(1)}
                  options={filter.options}
                />
              </div>
            ))
          : filters.map((filter) => {
              const filterValue = table
                .getColumn(filter.row)
                ?.getFilterValue() as string[];
              return (
                <div key={filter.row}>
                  <Select
                    value={
                      filterValue && filterValue.length > 0
                        ? filterValue[0]
                        : ""
                    }
                    onValueChange={(value) =>
                      table.getColumn(filter.row)?.setFilterValue([value])
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
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
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm" className="h-8 font-normal">
              <Columns />
              Toggle Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
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
        <DataTableViewSwitcher view={view} setView={setView} table={table} />
      </div>
    </div>
  );
}
