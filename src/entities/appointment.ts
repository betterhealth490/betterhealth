export interface GetAppointmentInput {
  date: Date;
  notes: string;
}

export interface GetAppointmentResult {
  appointmentDate: Date;
  appointmentId: number;
  therapistId: number;
  patientId: number;
  notes: string;
  status: "Pending" | "Confirmed" | "Cancelled";
}

export interface ListAppointmentInput {
  appointmentDate: Date;
  appointmentId: number;
  therapistId: number;
  patientId: number;
  notes: string;
}

export interface ListAppointmentResult {
  appointmentDate: Date;
  appointmentId: number;
  therapistId: number;
  patientId: number;
}

export interface UpdateAppointmentInput {
  appointmentDate: Date;
  notes: string;
}

export interface UpdateAppointmentResult {
  appointmentDate: Date;
  appointmentId: number;
  therapistId: number;
  patientId: number;
  status: "Pending" | "Confirmed" | "Cancelled";
}

export interface CreateAppointmentInput {
  appointmentDate: Date;
  status: "Pending" | "Confirmed" | "Cancelled";
}

export interface CreateAppointmentResult {
  appointmentDate: Date;
  status: "Pending" | "Confirmed" | "Cancelled";
}
