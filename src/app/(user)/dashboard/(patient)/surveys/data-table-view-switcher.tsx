import { LineChart, Table } from "lucide-react";

import { Button } from "~/components/ui/button";

interface DataTableViewSwitcherProps {
  view: "table" | "line";
  setView: (view: "table" | "line") => void;
}

export function DataTableViewSwitcher({
  view,
  setView,
}: DataTableViewSwitcherProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-auto hidden h-8 lg:flex"
      onClick={() => setView(view === "table" ? "line" : "table")}
    >
      {view === "table" && (
        <>
          <Table />
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
