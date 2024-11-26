import { CalendarPlusIcon } from "lucide-react";

export function ScheduleAppointment({date}: {date: Date}){
    return(
        <div className="border-[3px] rounded-[8px] justify-center items-center place-content-center place-items-center h-full w-full">
            <button className="flex gap-2.5 px-4 py-2 border rounded-[8px] items-center bg-primary text-white">
                <CalendarPlusIcon size={24}/>
                <span className="text-2xl">Schedule Appointment</span>
            </button>
        </div>
    )
}