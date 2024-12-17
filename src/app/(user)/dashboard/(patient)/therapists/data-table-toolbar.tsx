import { type Table } from "@tanstack/react-table";
import { Columns, X } from "lucide-react";

import { Button } from "~/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatCamelCase } from "~/lib/utils";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Input } from "~/components/ui/input";
import { DataTableAgeFilter } from "./data-table-age-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter therapists..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("age") && (
          <DataTableAgeFilter column={table.getColumn("age")} />
        )}
        {table.getColumn("gender") && (
          <DataTableFacetedFilter
            title="Gender"
            column={table.getColumn("gender")}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            title="Status"
            column={table.getColumn("status")}
            options={[
              { label: "Current", value: "current" },
              { label: "Accepting", value: "accepting" },
              { label: "Not Accepting", value: "not accepting" },
              { label: "Pending", value: "pending" },
            ]}
          />
        )}
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
      </div>
    </div>
  );
}
