"use client";

import { useState } from "react";
import { type DateRange } from "react-day-picker";
import { columns, type TherapistSurvey } from "./columns";
import { DataTable } from "./data-table";
import { formatName, isDefined } from "~/lib/utils";
import { addDays, addWeeks } from "date-fns";

export function TherapistSurveys({ surveys }: { surveys: TherapistSurvey[] }) {
  const [date, setDate] = useState<DateRange | undefined>({
    to: addDays(new Date(new Date().toDateString()).getTime() - 1, 1),
    from: addWeeks(new Date(new Date().toDateString()), -1),
  });
  const patients = new Map();
  surveys.forEach(({ patient }) =>
    patients.set(patient.id, formatName(patient)),
  );

  const filters = [
    {
      row: "patient",
      options: [...patients.keys()].map((key) => ({
        label: patients.get(key),
        value: key,
      })),
    },
  ];
  return (
    <DataTable
      columns={columns}
      date={date}
      setDate={setDate}
      data={surveys.filter((survey) => inRange(date, survey.date))}
      filters={[...new Set(filters)]}
    />
  );
}

function inRange(range: DateRange | undefined, date: Date) {
  if (!isDefined(range)) {
    return true;
  }
  const after = range.from ? date >= range.from : true;
  const before = range.to ? date <= range.to : true;
  return after && before;
}
