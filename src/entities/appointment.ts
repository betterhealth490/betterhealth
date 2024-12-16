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
}

export interface ListAppointmentsItem {
  appointmentDate: Date;
  appointmentId: number;
  therapistId: number;
  patientId: number;
  status: "pending" | "confirmed" | "cancelled";
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

export interface GetTherapistAvailabilityInput {
  therapistId: number;
  day: number; // Day of the week: 0 (Sunday) to 6 (Saturday)
  date: string; // Date in "YYYY-MM-DD" format
}

export interface GetTherapistAvailabilityResult {
  day: number;
  availableSlots: string[]; // Array of available time slots in HH:MM format
}