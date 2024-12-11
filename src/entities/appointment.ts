export interface GetAppointmentInput {
    appointmentId: number;
}

export interface GetAppointmentResult {
  appointmentDate: Date;
  appointmentId: number;
  therapistId: number;
  patientId: number;
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
}

export interface ListAppointmentsInput {
  userId: number;
  date: Date;
}

export interface ListAppointmentsItem {
  appointmentDate: Date;
  appointmentId: number;
  therapistId: number;
  patientId: number;
}

export type ListAppointmentsResult = ListAppointmentsItem[];

export interface UpdateAppointmentInput {
  appointmentDate: Date;
  appointmentId: number;
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
}

export interface UpdateAppointmentResult {
  appointmentDate: Date;
  appointmentId: number;
  therapistId: number;
  patientId: number;
  status: "pending" | "confirmed" | "cancelled";
}

export interface CreateAppointmentInput {
  appointmentDate: Date;
  patientId: number;
  therapistId: number;
  notes: string;
}

export interface CreateAppointmentResult {
  appointmentDate: Date;
  appointmentId: number;
  patientId: number;
  therapistId: number;
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
}
