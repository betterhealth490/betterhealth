'use client'

import React, { Dispatch, SetStateAction } from "react";
import { SelectSingleEventHandler } from "react-day-picker";
import { Calendar } from "~/components/ui/calendar";

interface AppointmentCalendarProps{
    date: Date | undefined;
    setDate: Dispatch<SetStateAction<Date | undefined>>
}

export function AppointmentCalendar({date, setDate}: AppointmentCalendarProps){

    return(
        <div className="items-center place-content-center place-items-center h-full w-full">
            <Calendar 
                className="border rounded-[3px] place-content-center place-items-center"
                mode="single"
                selected={date}
                onSelect={setDate}
            />
        </div>
    )
}