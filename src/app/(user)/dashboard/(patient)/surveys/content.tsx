"use client";

import { useState } from "react";
import { type DateRange } from "react-day-picker";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { isDefined } from "~/lib/utils";
import { addWeeks } from "date-fns";

export function PatientSurveys({
  surveys,
}: {
  surveys: {
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
  }[];
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    to: new Date(new Date().toDateString()),
    from: addWeeks(new Date(new Date().toDateString()), -1),
  });
  return (
    <DataTable
      columns={columns}
      date={date}
      setDate={setDate}
      data={surveys.filter((survey) => inRange(date, survey.date))}
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
