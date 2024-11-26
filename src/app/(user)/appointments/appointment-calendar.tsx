'use client'

import React from "react";
import { SelectSingleEventHandler } from "react-day-picker";
import { Calendar } from "~/components/ui/calendar";

interface AppointmentCalendarProps{
    date: Date;
    setDate: (date: Date) => SelectSingleEventHandler | undefined;
}

export function AppointmentCalendar({date, setDate}: AppointmentCalendarProps){

    return(
        <div className="justify-center items-center place-content-center place-items-center h-full w-full">
            <Calendar 
                className="border rounded-[3px] place-content-center place-items-center scale-[3]"
                mode="single"
                selected={date}
                onSelect={setDate(date)}
            />
        </div>
    )
}