export interface GetAppointmentInput{
    userId: string,
    date: Date
}

export interface GetAppointmentResult{
    appointmentDate: Date,
    appointmentId: number,
    status: "Pending" | "Confirmed" | "Cancelled",
    notes: string,
    therapistId: number,
    patientId: number
}

export  interface GetAppointmentUpdate{
    appointmentDate: Date,
    appointmentId: number,
    status: "Pending" | "Confirmed" | "Cancelled",
    therapistId: number,
    patientId: number
}

export interface GetAppointmentList{
    appointmentDate: Date,
    appointmentId: number,
    status: "Pending" | "Confirmed" | "Cancelled",
    therapistId: number,
    patientId: number
}

