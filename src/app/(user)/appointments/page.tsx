import React from "react";
import { AppointmentCalendar } from "./appointment-calendar";
import { ScheduleAppointment } from "./schedule-appointment";
import { isDefined } from "~/lib/utils";

export default function AppointmentsPage() {
    const [date, setDate] = React.useState<Date>(new Date())
    
    return(
        <div className="flex justify-center items-center h-[90svh] w-full">
            <AppointmentCalendar date={date} setDate={setDate}/>
            { isDefined(date) && <ScheduleAppointment date={date}/> }
        </div>
    )
}
