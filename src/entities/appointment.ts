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

