'use client'

import React from "react";
import { AppointmentCalendar } from "./appointment-calendar";
import { ScheduleAppointment } from "./schedule-appointment";
import { isDefined } from "~/lib/utils";
import { PageWrapper } from "../page-wrapper";

export default function AppointmentsPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const today = new Date()
    
    return(
        <PageWrapper className="p-4">
            <div className="flex justify-center items-center h-full w-full">
                <AppointmentCalendar date={date} setDate={setDate}/>
                { isDefined(date) && <ScheduleAppointment date={date}/> }
            </div>
        </PageWrapper>
    )
}
