import { LineChart, Table as TableIcon } from "lucide-react";

import { type Table } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";

interface DataTableViewSwitcherProps<TData> {
  table: Table<TData>;
  view: "table" | "line";
  setView: (view: "table" | "line") => void;
}

export function DataTableViewSwitcher<TData>({
  table,
  view,
  setView,
}: DataTableViewSwitcherProps<TData>) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-auto hidden h-8 lg:flex"
      onClick={() => {
        setView(view === "table" ? "line" : "table");
        table.getColumn("patient")?.setFilterValue(undefined);
      }}
    >
      {view === "table" && (
        <>
          <TableIcon />
          Table View
        </>
      )}
      {view === "line" && (
        <>
          <LineChart />
          Graph View
        </>
      )}
    </Button>
  );
}
